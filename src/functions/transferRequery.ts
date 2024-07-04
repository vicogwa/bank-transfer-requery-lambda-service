import { SQSHandler, SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { RequeryService } from '../services';

// Initialize the SQS service
const sqs = new AWS.SQS();

/**
 * AWS Lambda handler to process SQS messages.
 *
 * @param event - The SQS event containing the messages to be processed.
 */
export const handler: SQSHandler = async (event: SQSEvent): Promise<void> => {
    let messageBody: any; // Variable to hold the message body for error handling
    const transferRequeryService = new RequeryService(); // Initialize the service once outside the loop

    try {
        // Loop through each record in the SQS event
        for (const record of event.Records) {
            messageBody = record.body; // Extract the message body
            await transferRequeryService.processMessageAsync(messageBody); // Process the message
        }
    } catch (error) {
        if (messageBody) {
            // Prepare parameters for sending the message to another SQS queue
            const sqsParams: AWS.SQS.SendMessageRequest = {
                QueueUrl: process.env.TransferRequeryQueueUrl as string, // The URL of the queue to which the message should be sent
                MessageBody: messageBody, // The message body to be retried
            };

            try {
                await sqs.sendMessage(sqsParams).promise(); // Send the message to the SQS queue for reprocessing
            } catch (sqsError) {
                console.error('Error sending message to SQS:', sqsError);
                // Handle or log the error appropriately
            }
        }

        // Log the error for debugging purposes
        console.error('Error processing message:', error);

        // Optionally re-throw the error to invoke the Lambda's retry behavior
        // throw error;
    }
};
