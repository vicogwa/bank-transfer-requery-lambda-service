import { SQSHandler, SQSEvent } from 'aws-lambda';
import { RequeryService } from '../services';

export const handler: SQSHandler = async (event: SQSEvent): Promise<void> => {
    try {
        const airtimeTransactionService = new RequeryService();
        for (const message of event.Records) {
            await airtimeTransactionService.processMessageAsync((message as any).body);
        }
    } catch (error) {
        console.error('Handler error:', error);
        throw error;
    }
};
