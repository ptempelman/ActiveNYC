import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const ratingRouter = createTRPCRouter({

    isRated: privateProcedure
        .input(z.object({ userId: z.string().nullish(), activityId: z.string().nullish() }))
        .query(async ({ ctx, input }) => {
            if (!input.userId || !input.activityId) return { rated: false };
            const { userId, activityId } = input;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const existingEntry = await ctx.prisma.rating.findFirst({
                where: {
                    userId: userId,
                    activityId: activityId,
                },
            });
            if (!existingEntry) {
                return { rated: false }
            }
            return { rated: true }
        }),

    create: privateProcedure
        .input(
            z.object({
                rating: z.number(),
                activityId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const rating = await ctx.prisma.rating.upsert({
                where: {
                    userId_activityId: {
                        userId: userId,
                        activityId: input.activityId,
                    },
                },
                update: {
                    rating: input.rating,
                },
                create: {
                    userId: userId,
                    rating: input.rating,
                    activityId: input.activityId,
                },
            });

            const averageRating = await ctx.prisma.rating.aggregate({
                where: { activityId: input.activityId },
                _avg: { rating: true },
            });


            const activityUpdate = await ctx.prisma.activity.update({
                where: {
                    id: input.activityId,
                },
                data: {
                    averageRating: averageRating._avg.rating,
                },
            });

            return rating;
        }),

});