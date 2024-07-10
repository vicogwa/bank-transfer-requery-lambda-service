import { postRequest } from '../shared';
import { SQSRecord } from 'aws-lambda';

interface SnsEnvelope {
    Type: string;
    MessageId: string;
    SequenceNumber: string;
    TopicArn: string;
    Subject: string;
    Message: string; // This is the actual message content as a JSON string
    Timestamp: string;
    UnsubscribeURL: string;
}

export class RequeryService {
    /**
     * Processes an SQS message asynchronously.
     *
     * @param {SQSRecord} sqsBody - The SQS message to process.
     * @returns {Promise<void>} - A promise that resolves when the message has been processed.
     */
    async processMessageAsync(sqsBody: SQSRecord): Promise<void> {
        try {
            // Parse the SQS message body if it's a string
            const queueBody: SnsEnvelope = (typeof sqsBody == 'string' ? JSON.parse(sqsBody) : sqsBody) as any;
            const Message: any =
                typeof queueBody['Message'] == 'string' ? JSON.parse(queueBody.Message) : queueBody.Message;
            if (Message.sns_status[0] == 'Pending') {
                const transactionRef: string = Message.charge.RelatedTransaction;

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
