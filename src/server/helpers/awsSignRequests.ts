import { Sha256 } from "@aws-crypto/sha256-browser";
import { defaultProvider } from "@aws-sdk/credential-provider-node"; // For Node.js applications
import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { formatUrl } from "@aws-sdk/util-format-url";

// Function to sign requests
export async function signRequest(
    method: string, // HTTP method as a string
    url: string, // URL as a string
    body?: any // Optional body, typed as any for flexibility, use a specific type as needed
): Promise<Response> {
    const credentials = await defaultProvider()();
    console.log("Credentials from signRequest:", credentials)
    const endpoint = new URL(url);

    const request = new HttpRequest({
        method,
        protocol: endpoint.protocol,
        hostname: endpoint.hostname,
        path: endpoint.pathname,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const signer = new SignatureV4({
        credentials,
        region: 'us-east-1', // Your AWS region
        service: 'execute-api', // For API Gateway
        sha256: Sha256,
    });

    const signedRequest = await signer.sign(request);

    return fetch(formatUrl(signedRequest), {
        method,
        headers: signedRequest.headers,
        body: request.body,
    });
}
