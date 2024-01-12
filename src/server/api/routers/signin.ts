import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const signinRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(z.string().nullable())
        .query(async ({ ctx, input }) => {
            if (input) {
                const existingUser = await ctx.prisma.user.findUnique({
                    where: { email: input },
                });

                if (!existingUser) {
                    await ctx.prisma.user.create({
                        data: { email: input },
                        // Add other fields as necessary
                    });
                }
            }
            return { message: 'Sign-in successful' };
        }),
});