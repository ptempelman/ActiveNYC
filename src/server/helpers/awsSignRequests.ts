
import { AwsClient } from 'aws4fetch';

export async function signRequest(method: string, url: string, body?: any): Promise<Response> {

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
        throw new Error("AWS credentials not found");
    }

    const aws = new AwsClient({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = await aws.fetch(url, {
        method: method,
        headers: body ? headers : {},
        body: body ? JSON.stringify(body) : undefined,
    });

    return response;
}