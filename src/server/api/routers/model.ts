import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const modelRouter = createTRPCRouter({

    retrainModel: publicProcedure
        .input(z.object({ userId: z.string().nullish(), userInteractions: z.number().nullish(), userInteractionThreshold: z.number().nullish() }))
        .mutation(async ({ ctx, input }) => {

            const { userId, userInteractions, userInteractionThreshold } = input;

            if (!userId) {
                throw new Error("userId not found");
            }

            if (!userInteractions) {
                throw new Error("userInteractions not found");
            }

            if (!userInteractionThreshold) {
                throw new Error("userInteractionThreshold not found");
            }

            console.log(userId, userInteractions, userInteractionThreshold);
            if (userInteractions < userInteractionThreshold) {
                throw new Error("not enough interactions");
            }


            const url = process.env.ML_API_ENDPOINT + "/retrain";
            if (!url) {
                throw new Error("ML_API_ENDPOINT not found");
            }

            console.log("Full URL:", url);
            interface ResultType {
                [key: string]: number;
            }

            let result: ResultType | null = null;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseJson = await response.json();
                result = responseJson as ResultType;
                return { message: "Success" };
            } catch (error) {
                console.error("Error calling FastAPI endpoint:", error);
                throw new Error('Error calling FastAPI endpoint:');
            }

        }),
});