import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signRequest } from "~/server/helpers/awsSignRequests";

export const modelRouter = createTRPCRouter({

    retrainModel: publicProcedure
        .input(z.object({ userId: z.string().nullish(), userInteractions: z.number().nullish(), userInteractionThreshold: z.number().nullish() }))
        .mutation(async ({ ctx, input }) => {

            const endpoint = process.env.AWS_API_ENDPOINT;
            if (!endpoint) {
                throw new Error("AWS_API_ENDPOINT not found");
            }

            const url = `${endpoint}/retrain`;

            console.log("Full URL:", url);

            interface ResultType {
                message: string;
            }

            let result: ResultType | null = null;

            try {
                const response = await signRequest('GET', url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                result = await response.json() as ResultType;
                console.log(result);
                return { message: "Success" };
            } catch (error) {
                console.error("Error calling FastAPI endpoint:", error);
                throw new Error('Error calling FastAPI endpoint:');
            }

        }),
});