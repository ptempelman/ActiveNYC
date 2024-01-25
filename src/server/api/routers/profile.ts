
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({

  getNextInteractionThreshold: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return { threshold: user.nextInteractionThreshold };
    }),

  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        // if we hit here we need a unsantized username so hit api once more and find the user.
        const users = (
          await clerkClient.users.getUserList({
            limit: 200,
          })
        )
        const user = users.find((user) => user.externalAccounts.find((account) => account.username === input.username));
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "User not found",
          });
        }
        return filterUserForClient(user)
      }

      return filterUserForClient(user);

    }),

  isAdminUser: privateProcedure
    .input(z.object({ userId: z.string().nullish() }))
    .query(async ({ ctx, input }) => {

      if (!input.userId) {
        return { isAdmin: false }
      }

      // Fetch the user from the database
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        return { isAdmin: false }
      }

      console.log(user.role)

      // Check if the user has an 'Admin' role
      return { isAdmin: user.role === 'admin' }
    }),
});
