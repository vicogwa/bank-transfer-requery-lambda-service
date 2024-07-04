import { SQSRecord } from 'aws-lambda';
import { postRequest } from '../shared';

export class RequeryService {
    async processMessageAsync(message: SQSRecord): Promise<void> {
        try {
            const SqsMessageBody = (typeof message == 'string' ? JSON.parse(message) : message) as any;
            const messageBody: any =
                typeof SqsMessageBody['Message'] == 'string'
                    ? JSON.parse(SqsMessageBody.Message)
                    : SqsMessageBody.Message;
            // const subject: string = SqsMessageBody['Subject'];
            const transaction_ref: string =
                messageBody.transaction_id || messageBody.ClientResponse.TransactionReference;
            await postRequest(transaction_ref);
        } catch (error: any) {
            console.error('ERROR OCCURED', error.message);
            throw error;
        }
    }
}
