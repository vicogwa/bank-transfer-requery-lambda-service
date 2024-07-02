import axios from 'axios';
import { createHmac } from 'crypto';
import { IRequestBody } from '../interfaces';

export const postRequest = async (transaction_ref: string) => {
    const reversalUrl = process.env.ReversalEndpoint || '';
    const request_body: IRequestBody = { transaction_ref: transaction_ref };
    const signature = await getSignature(request_body);

    const headers = {
        'Content-Type': 'application/json',
        'X-Hmac-Signature': signature,
        Accept: 'application/json',
    };

    const response = await axios.put(reversalUrl, request_body, { headers });
    return response.data;
};

const getSignature = async (request_body: IRequestBody) => {
    const hmac = createHmac('sha256', process.env.WalletHmacKey || '');
    hmac.update(JSON.stringify(request_body), 'utf8');
    const signature = hmac.digest().toString('hex');
    return signature;
};
