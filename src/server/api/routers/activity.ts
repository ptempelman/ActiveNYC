import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const activityRouter = createTRPCRouter({

    getAll: publicProcedure.query(async ({ ctx }) => {
        const activities = await ctx.prisma.activity.findMany({
            take: 100,
        });

        return activities;
    }),
});