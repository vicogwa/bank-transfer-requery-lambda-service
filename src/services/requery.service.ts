import { SQSRecord } from 'aws-lambda';
import { postRequest } from '../shared';

export class RequeryService {
    async processMessageAsync(message: SQSRecord): Promise<void> {
        try {
            const SqsMessageBody = (typeof message == 'string' ? JSON.parse(message) : message) as any;

            if (SqsMessageBody.sns_status[0] == 'Pending') {
                const transaction_ref: string = SqsMessageBody.transaction_id || SqsMessageBody.RelatedTransaction;
                const result = await postRequest(transaction_ref);
                console.log(result);
            }
        } catch (error: any) {
            console.error('ERROR OCCURED', error.message);
            throw error;
        }
    }
}
