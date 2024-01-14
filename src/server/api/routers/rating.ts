import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { ratelimit } from "./posts";

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
                barSpeed: z.number(),
                music: z.number(),
                worthIt: z.number(),
                experience: z.number(),
                activityId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const rating = await ctx.prisma.rating.create({
                data: {
                    userId,
                    barSpeed: input.barSpeed,
                    music: input.music,
                    worthIt: input.worthIt,
                    experience: input.experience,
                    activityId: input.activityId,
                },
            });

            const averageRatingBarSpeed = await ctx.prisma.rating.aggregate({
                where: { activityId: input.activityId },
                _avg: { barSpeed: true },
            });

            const averageRatingMusic = await ctx.prisma.rating.aggregate({
                where: { activityId: input.activityId },
                _avg: { music: true },
            });

            const averageRatingWorthIt = await ctx.prisma.rating.aggregate({
                where: { activityId: input.activityId },
                _avg: { worthIt: true },
            });

            const averageRatingExperience = await ctx.prisma.rating.aggregate({
                where: { activityId: input.activityId },
                _avg: { experience: true },
            });

            const activityUpdate = await ctx.prisma.activity.update({
                where: {
                    id: input.activityId,
                },
                data: {
                    averageRatingBarSpeed: averageRatingBarSpeed._avg.barSpeed,
                    averageRatingMusic: averageRatingMusic._avg.music,
                    averageRatingWorthIt: averageRatingWorthIt._avg.worthIt,
                    averageRatingExperience: averageRatingExperience._avg.experience,
                },
            });

            return rating;
        }),

});