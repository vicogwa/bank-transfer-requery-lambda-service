import { SQSRecord } from 'aws-lambda';
import { postRequest } from '../shared';

export class RequeryService {
    /**
     * Processes an SQS message asynchronously.
     *
     * @param {SQSRecord} message - The SQS message to process.
     * @returns {Promise<void>} - A promise that resolves when the message has been processed.
     */
    async processMessageAsync(message: SQSRecord): Promise<void> {
        try {
            // Parse the SQS message body if it's a string
            const sqsMessageBody = (typeof message == 'string' ? JSON.parse(message) : message) as any;

            // Check if the SNS status is 'Pending'
            if (sqsMessageBody.sns_status[0] == 'Pending') {
                // Extract the transaction reference from the message body
                const transactionRef: string = sqsMessageBody.transaction_id || sqsMessageBody.RelatedTransaction;

                // Requery the transaction using the extracted reference
                const result = await postRequest(transactionRef);

                // Log the result
                console.log(result);
            }
        } catch (error: any) {
            // Log the error and rethrow it
            console.error('ERROR OCCURRED', error.message);
            throw error;
        }
    }
}
