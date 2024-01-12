import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const signinRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.object({ id: z.string().nullish(), email: z.string().nullish() }))
        .query(async ({ ctx, input }) => {
            if (input.id && input.email) {
                const existingUser = await ctx.prisma.user.findUnique({
                    where: { id: input.id },
                });

                if (!existingUser) {
                    await ctx.prisma.user.create({
                        data: { id: input.id, email: input.email, },
                        // Add other fields as necessary
                    });
                }
            }
            return { message: 'Sign-in successful' };
        }),
});