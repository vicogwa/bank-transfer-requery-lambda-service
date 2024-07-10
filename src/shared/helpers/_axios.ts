import axios from 'axios';
import { createHmac } from 'crypto';
import { IRequestBody } from '../interfaces';

/**
 * Sends a PATCH request to requery a transaction.
 *
 * @param {string} transactionRef - The transaction reference to requery.
 * @returns {Promise<any>} - The response data from the request.
 */
export const postRequest = async (transactionRef: string): Promise<any> => {
    const baseUrl = process.env.BaseUrl || 'https://dev.wallet.irechargetech.com';
    const transactionRequeryUrl = `${baseUrl}/api/EventHandlers/transfer/requery`;

    // Create the request body with the transaction reference
    const requestBody: IRequestBody = { transaction_ref: transactionRef };

    // Get the HMAC signature for the request
    const signature = await getSignature(transactionRef);

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
 * @returns {Promise<string>} - The generated HMAC signature.
 */
const getSignature = async (requestBody: string): Promise<string> => {
    const hmac = createHmac('sha256', process.env.WalletHmacKey || '');

    // Update the HMAC with the JSON string of the request body
    hmac.update(JSON.stringify(requestBody), 'utf8');

    // Generate and return the HMAC signature in hexadecimal format
    return hmac.digest('hex');
};
