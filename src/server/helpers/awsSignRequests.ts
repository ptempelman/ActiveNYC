

import { Sha256 } from "@aws-crypto/sha256-browser";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";

import fetch from 'node-fetch';

export async function signRequest<T = unknown>(method: string, url: string, payload: T | undefined = undefined) {
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;

    if (!awsAccessKeyId || !awsSecretAccessKey || !region) {
        throw new Error('AWS credentials not found');
    }

    const endpoint = new URL(url);

    const request = new HttpRequest({
        method: method,
        protocol: endpoint.protocol,
        hostname: endpoint.hostname,
        path: endpoint.pathname,
        headers: {
            host: endpoint.host,
            accept: 'application/json',
            'content-type': 'application/json',
        },
        body: payload !== undefined ? JSON.stringify(payload) : undefined,
    })

    const signer = new SignatureV4({
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        },
        service: 'execute-api',
        region: region,
        sha256: Sha256,
    });

    const signedRequest = await signer.sign(request);

    return fetch(url, {
        method: signedRequest.method,
        headers: signedRequest.headers,
        body: signedRequest.body as string,
    });
}
