import axios from 'axios';
import { createHmac } from 'crypto';
import { IRequestBody } from '../interfaces';

export const postRequest = async (transaction_ref: string) => {
    // const transactionRequeryUrl = process.env.TransferRequeryEndpoint || '';
    const baseUrl = 'https://staging.payment.irechargetech.com';
    // const transaction_ref: IRequestBody = { transaction_ref: transaction_ref };
    const signature = await getSignature(transaction_ref);

    const headers = {
        'Content-Type': 'application/json',
        'X-Hmac-Signature': signature,
        Accept: 'application/json',
    };

    const response = await axios.put(`${baseUrl}/api/EventHandlers/transfer/${transaction_ref}/requery`, { headers });
    return response.data;
};

const getSignature = async (request_body: string) => {
    const hmac = createHmac('sha256', process.env.WalletHmacKey || '');
    hmac.update(JSON.stringify(request_body), 'utf8');
    const signature = hmac.digest().toString('hex');
    return signature;
};
