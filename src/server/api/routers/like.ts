import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({


    createLikeDislike: privateProcedure.input(
        z.object({ userId: z.string().nullish(), activityId: z.string().nullish(), liked: z.boolean() })
    )
        .mutation(async ({ ctx, input }) => {
            const { userId, activityId, liked } = input;

            if (!userId || !activityId) {
                throw new Error("NO USER ID OR ACTIVITY ID WHILE LIKING");
            }

            // const { success } = await ratelimit.limit(userId);
            // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const likeDislike = await ctx.prisma.like.upsert({
                where: {
                    userActivity_unique: {
                        userId: userId,
                        activityId: activityId,
                    },
                },
                update: {
                    liked: liked,
                },
                create: {
                    userId: userId,
                    activityId: activityId,
                    liked: liked,
                },
            });

            return likeDislike;
        }),




});