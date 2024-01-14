import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { ratelimit } from "./posts";

export const activityRouter = createTRPCRouter({

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