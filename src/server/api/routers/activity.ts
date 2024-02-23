import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { InvokeEndpointCommand, SageMakerRuntimeClient } from "@aws-sdk/client-sagemaker-runtime";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const activityRouter = createTRPCRouter({

    getInteractionCount: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { userId } = input;

            const likes = await ctx.prisma.like.count({
                where: {
                    userId: userId,
                },
            });

            const saves = await ctx.prisma.savedActivities.count({
                where: {
                    A: userId,
                },
            });

            const ratings = await ctx.prisma.rating.count({
                where: {
                    userId: userId,
                },
            });

            return { interactionCount: likes + saves + ratings }

        }),

    createNew: privateProcedure
        .input(z.object({
            name: z.string(),
            address: z.string(),
            description: z.string(),
            websiteUrl: z.string(),
            latitude: z.number(),
            longitude: z.number(),
            categories: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {

            const categoryIds = await Promise.all(input.categories.map(async (categoryName) => {
                const category = await ctx.prisma.category.findUnique({
                    where: { name: categoryName },
                });
                if (!category) {
                    throw new Error(`Category not found: ${categoryName}`);
                }
                return category.id;
            }));

            const newActivity = await ctx.prisma.activity.create({
                data: {
                    name: input.name,
                    address: input.address,
                    description: input.description,
                    websiteUrl: input.websiteUrl,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    categories: {
                        connect: categoryIds.map((id) => ({ id })),
                    },
                },
            });

            return newActivity;
        }),

    searchActivitiesPreferNonLiked: privateProcedure
        .input(z.object({ userId: z.string().nullish(), searchText: z.string(), selectedCategoryIds: z.array(z.string()) }))
        .query(async ({ ctx, input }) => {
            const { userId, searchText, selectedCategoryIds } = input;

            if (!userId) {
                throw new Error("NO USER ID");
            }

            let where = undefined;

            // Check if searchText is not empty, and build the searchText condition
            if (searchText) {
                where = {
                    OR: [
                        { name: { contains: searchText } },
                        { description: { contains: searchText } },
                    ]
                };
            }

            // Check if selectedCategoryIds is not empty, and build the category name conditions
            if (selectedCategoryIds.length > 0) {
                const categoryConditions = selectedCategoryIds.map(name => ({
                    categories: {
                        some: { name }
                    }
                }));

                // If where is undefined, set it to the categoryConditions
                if (!where) {
                    where = {
                        OR: categoryConditions
                    };
                } else {
                    // Combine searchText condition with categoryConditions using OR
                    where = {
                        OR: [
                            where,
                            ...categoryConditions
                        ]
                    };
                }
            }

            // Conditionally apply the where condition only when where is defined
            const activities = where
                ? await ctx.prisma.activity.findMany({
                    where,
                    include: {
                        categories: true,
                        savedByUsers: true,
                        likes: { // Include likes to check if the user has liked the activity
                            where: { userId: userId },
                        },
                    },
                })
                : await ctx.prisma.activity.findMany({
                    include: {
                        categories: true,
                        savedByUsers: true,
                        likes: { // Include likes to check if the user has liked the activity
                            where: { userId: userId },
                        },
                    },
                });



            // TODO: Base score on ML model calls
            const client = new SageMakerRuntimeClient({});

            const data = {
                userId: userId,
                activityIds: activities.map(activity => activity.id),
            };

            // Convert the data to JSON
            const payload = JSON.stringify(data);
            interface ResultType {
                [key: string]: number;
            }

            let result: ResultType | null = null;

            const command = new InvokeEndpointCommand({
                EndpointName: 'sagemaker-scikit-learn-2024-01-25-15-53-06-786',
                ContentType: 'application/json',
                Body: payload
            });

            try {
                const response = await client.send(command);

                // Assuming the response is in JSON format
                result = JSON.parse(new TextDecoder("utf-8").decode(response.Body)) as ResultType;
                // console.log(result);
            } catch (error) {
                console.error("Error invoking SageMaker endpoint:", error);
                throw new Error('Error invoking SageMaker endpoint:');
            }

            type ActivityWithScore = {
                activity: typeof activities[0],
                score: number | null,
            }

            let activitiesWithScores: ActivityWithScore[] = activities.map(activity => {
                const score = result ? result[activity.id] : null;
                return {
                    activity,
                    score: score !== undefined ? score : null, // or a default score if not found
                };
            }); // .filter(activityWithScore => activityWithScore.score !== null);

            // Step 2: Calculate scores for each activity
            // let activitiesWithScores: ActivityWithScore[] = activities.map(activity => {
            //     let score = 0;
            //     if (searchText) {
            //         if (activity.name.toLowerCase().includes(searchText)) score += 3;
            //         if (activity.description.toLowerCase().includes(searchText)) score += 2;
            //     }
            //     if (selectedCategoryIds.length > 0) {
            //         const matchedCategories = activity.categories.filter(cat => selectedCategoryIds.includes(cat.name));
            //         score += matchedCategories.length;
            //     }

            //     const userHasLiked = activity.likes.length > 0;
            //     if (!userHasLiked) {
            //         score += 5;
            //     }
            //     return { activity, score };
            // });

            // Step 3: Sort activities based on the score
            activitiesWithScores = activitiesWithScores.sort((a, b) => {
                if (a.score === null && b.score === null) return 0;
                if (a.score === null) return 1;
                if (b.score === null) return -1;
                return b.score - a.score;
            });

            return activitiesWithScores.map(activityWithScore => activityWithScore.activity);
        }),

    searchActivities: publicProcedure
        .input(z.object({ searchText: z.string(), selectedCategoryIds: z.array(z.string()) }))
        .query(async ({ ctx, input }) => {
            const { searchText, selectedCategoryIds } = input;


            let where = undefined;

            // Check if searchText is not empty, and build the searchText condition
            if (searchText) {
                where = {
                    OR: [
                        { name: { contains: searchText } },
                        { description: { contains: searchText } },
                    ]
                };
            }

            // Check if selectedCategoryIds is not empty, and build the category name conditions
            if (selectedCategoryIds.length > 0) {
                const categoryConditions = selectedCategoryIds.map(name => ({
                    categories: {
                        some: { name }
                    }
                }));

                // If where is undefined, set it to the categoryConditions
                if (!where) {
                    where = {
                        OR: categoryConditions
                    };
                } else {
                    // Combine searchText condition with categoryConditions using OR
                    where = {
                        OR: [
                            where,
                            ...categoryConditions
                        ]
                    };
                }
            }

            // Conditionally apply the where condition only when where is defined
            const activities = where
                ? await ctx.prisma.activity.findMany({
                    where,
                    include: {
                        categories: true,
                        savedByUsers: true,
                    },
                })
                : await ctx.prisma.activity.findMany({
                    include: {
                        categories: true,
                        savedByUsers: true,
                    },
                });


            type ActivityWithScore = {
                activity: typeof activities[0],
                score: number,
            }

            // Step 2: Calculate scores for each activity
            let activitiesWithScores: ActivityWithScore[] = activities.map(activity => {
                let score = 0;
                if (searchText) {
                    if (activity.name.toLowerCase().includes(searchText)) score += 3;
                    if (activity.description.toLowerCase().includes(searchText)) score += 2;
                }
                if (selectedCategoryIds.length > 0) {
                    const matchedCategories = activity.categories.filter(cat => selectedCategoryIds.includes(cat.name));
                    score += matchedCategories.length;
                }
                return { activity, score };
            });

            // Step 3: Sort activities based on the score
            activitiesWithScores = activitiesWithScores.sort((a, b) => b.score - a.score);

            return activitiesWithScores.map(activityWithScore => activityWithScore.activity);
        }),

    getAll: publicProcedure.query(async ({ ctx }) => {
        const activities = await ctx.prisma.activity.findMany({
            take: 100,
            include: {
                categories: true,
                savedByUsers: true,
            }
        });

        return activities;
    }),

    getById: publicProcedure
        .input(z.object({ activityId: z.string() }))
        .query(async ({ ctx, input }) => {
            if (!input?.activityId) throw new TRPCError({ code: "NOT_FOUND" });

            const activity = await ctx.prisma.activity.findUnique({
                where: {
                    id: input.activityId,
                },
                include: {
                    categories: true,
                    savedByUsers: true,
                }
            });

            return activity;
        }),

    getAllBookmarks: privateProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {

            const savedActivityIds = await ctx.prisma.savedActivities.findMany({
                where: {
                    A: input.userId,
                },
                select: {
                    B: true, // Assuming 'B' stores activityId
                },
            });

            const activityIds = savedActivityIds.map(entry => entry.B);

            const activities = await ctx.prisma.activity.findMany({
                where: {
                    id: { in: activityIds },
                },
                include: {
                    categories: true,
                    savedByUsers: true,
                }
            });

            return activities;
        }),

    isBookmarked: privateProcedure
        .input(z.object({ userId: z.string().nullish(), activityId: z.string().nullish() }))
        .query(async ({ ctx, input }) => {
            if (!input.userId || !input.activityId) return { bookmarked: false };
            const { userId, activityId } = input;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const existingEntry = await ctx.prisma.savedActivities.findUnique({
                where: {
                    A_B: {
                        A: userId,
                        B: activityId,
                    },
                },
            });
            if (!existingEntry) {
                return { bookmarked: false }
            }
            return { bookmarked: true }
        }),

    bookmark: privateProcedure.input(
        z.object({ userId: z.string(), activityId: z.string() })
    )
        .mutation(async ({ ctx, input }) => {
            const { userId, activityId } = input;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const existingEntry = await ctx.prisma.savedActivities.findUnique({
                where: {
                    A_B: {
                        A: userId,
                        B: activityId,
                    },
                },
            });
            if (existingEntry) {
                throw new Error("ALREADY BOOKMARKED")
            }


            const bookmark = await ctx.prisma.savedActivities.create({
                data: {
                    A: userId,
                    B: activityId,
                },
            });

            return bookmark;
        }),

    unbookmark: privateProcedure.input(
        z.object({ userId: z.string(), activityId: z.string() })
    )
        .mutation(async ({ ctx, input }) => {
            const { userId, activityId } = input;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const existingEntry = await ctx.prisma.savedActivities.findUnique({
                where: {
                    A_B: {
                        A: userId,
                        B: activityId,
                    },
                },
            });
            if (!existingEntry) {
                throw new Error("NOT BOOKMARKED")
            }

            const bookmark = await ctx.prisma.savedActivities.delete({
                where: {
                    A_B: {
                        A: userId,
                        B: activityId,
                    },
                },
            });

            return { success: true };
        }),

});