import { SQSHandler, SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { RequeryService } from '../services';

const sqs = new AWS.SQS();

export const handler: SQSHandler = async (event: SQSEvent): Promise<void> => {
    let messageBody: any;
    try {
        for (const record of event.Records) {
            messageBody = record.body;
            const airtimeTransactionService = new RequeryService();
            await airtimeTransactionService.processMessageAsync(messageBody);
        }
    } catch (error) {
        if (messageBody) {
            const sqsparams: AWS.SQS.SendMessageRequest = {
                QueueUrl: process.env.TransferRequeryQueueUrl as string,
                MessageBody: messageBody,
            };
            await sqs.sendMessage(sqsparams).promise();
        }
        //throw error;
    }
};
