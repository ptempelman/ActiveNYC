import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signRequest } from "~/server/helpers/awsSignRequests";

export const modelRouter = createTRPCRouter({

    retrainModel: publicProcedure
        .input(z.object({ userId: z.string().nullish(), userInteractions: z.number().nullish(), userInteractionThreshold: z.number().nullish() }))
        .mutation(async ({ ctx, input }) => {

            // const { userId, userInteractions, userInteractionThreshold } = input;

            // if (!userId) {
            //     throw new Error("userId not found");
            // }

            // if (!userInteractions) {
            //     throw new Error("userInteractions not found");
            // }

            // if (!userInteractionThreshold) {
            //     throw new Error("userInteractionThreshold not found");
            // }

            // console.log(userId, userInteractions, userInteractionThreshold);
            // if (userInteractions < userInteractionThreshold) {
            //     throw new Error("not enough interactions");
            // }

            // const FunctionName = process.env.AWS_LAMBDA_RETRAIN_FUNCTION_NAME; // Your Lambda function name for retraining
            // if (!FunctionName) {
            //     throw new Error("AWS_LAMBDA_RETRAIN_FUNCTION_NAME not found");
            // }

            // const params = {
            //     FunctionName,
            //     InvocationType: 'RequestResponse',
            // };

            // try {
            //     const lambdaResponse = await lambda.invoke(params).promise();
            //     const payload = JSON.parse(lambdaResponse.Payload as string);

            //     console.log("Lambda retrain response:", payload);
            //     return { message: "Success" };
            // } catch (error) {
            //     console.error("Error invoking Lambda retrain function:", error);
            //     throw new Error('Error calling Lambda retrain function:');
            // }


            const url = `${process.env.AWS_API_ENDPOINT}/retrain`;
            if (!url) {
                throw new Error("AWS_API_ENDPOINT not found");
            }

            console.log("Full URL:", url);

            interface ResultType {
                message: string;
            }

            let result: ResultType | null = null;

            try {
                // const response = await fetch(url, {
                //     method: 'GET',
                // });

                const response = await signRequest('GET', url);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseJson = await response.json();
                result = responseJson as ResultType;
                console.log(result);
                return { message: "Success" };
            } catch (error) {
                console.error("Error calling FastAPI endpoint:", error);
                throw new Error('Error calling FastAPI endpoint:');
            }

        }),
});