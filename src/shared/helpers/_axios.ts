import axios from 'axios';
import { createHmac } from 'crypto';
import { IRequestBody } from '../interfaces';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let cachedSecret: any = null;

async function getSecret(): Promise<{ WalletHmacKey: string; BaseUrl: string }> {
    if (cachedSecret) return cachedSecret;
    const secretArn = process.env.SECRET_NAME!;
    const client = new SecretsManagerClient({});
    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await client.send(command);
    if (!response.SecretString) throw new Error('SecretString not found');
    const secret = JSON.parse(response.SecretString);
    cachedSecret = secret;
    return secret;
}

/**
 * Sends a PATCH request to requery a transaction.
 *
 * @param {string} transactionRef - The transaction reference to requery.
 * @returns {Promise<any>} - The response data from the request.
 */
export const postRequest = async (transactionRef: string): Promise<any> => {
    const { WalletHmacKey, BaseUrl } = await getSecret();
    const baseUrl = BaseUrl || 'https://dev.wallet.irechargetech.com';
    const transactionRequeryUrl = `${baseUrl}/api/EventHandlers/transfer/requery`;

    // Create the request body with the transaction reference
    const requestBody: IRequestBody = { transaction_ref: transactionRef };

    // Get the HMAC signature for the request
    const signature = await getSignature(transactionRef, WalletHmacKey);

    // Set up the request headers
    const headers = {
        'Content-Type': 'application/json',
        'X-Hmac-Signature': signature,
        Accept: 'application/json',
    };

    // Send the PATCH request and return the response data
    const response = await axios.patch(transactionRequeryUrl, requestBody, { headers });
    return response.data;
};

/**
 * Generates an HMAC signature for the request body.
 *
 * @param {string} requestBody - The request body to sign.
 * @param {string} hmacKey - The HMAC key from Secrets Manager.
 * @returns {Promise<string>} - The generated HMAC signature.
 */
const getSignature = async (requestBody: string, hmacKey: string): Promise<string> => {
    const hmac = createHmac('sha256', hmacKey);

    // Update the HMAC with the JSON string of the request body
    hmac.update(JSON.stringify(requestBody), 'utf8');

    // Generate and return the HMAC signature in hexadecimal format
    return hmac.digest('hex');
};