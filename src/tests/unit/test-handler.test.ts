import { SQSEvent, Context } from 'aws-lambda';
import { handler } from '../../functions/transferRequery';
import { RequeryService } from '../../services';
import { mockClient } from 'aws-sdk-client-mock';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { jest } from '@jest/globals';

// Mock the SQS client
const sqsMock = mockClient(SQSClient);

// Mock the SSM client
// const ssmMock = mockClient(SSMClient);

// Mock the RequeryService
jest.mock('../../services', () => ({
    RequeryService: jest.fn().mockImplementation(() => ({
        processMessageAsync: jest.fn(),
    })),
}));

// Set up environment variables as per the SAM template
process.env.TransferRequeryQueueUrl = '/wallet/TransferRequeryQueueUrl';

describe('Unit test for SQS handler', () => {
    beforeEach(() => {
        sqsMock.reset();
        // ssmMock.reset();
    });

    it('verifies successful message processing', async () => {
        // Mock the SSM GetParameterCommand
        ssmMock.on(GetParameterCommand, { Name: '/wallet/TransferRequeryQueueArn' }).resolves({
            Parameter: {
                Value: 'arn:aws:sqs:us-east-1:123456789012:TransferRequeryQueue',
            },
        });

        const event: SQSEvent = {
            Records: [
                {
                    messageId: '1',
                    receiptHandle: '1',
                    body: JSON.stringify({ key: 'value' }),
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: '1623238587645',
                        SenderId: '123456789012',
                        ApproximateFirstReceiveTimestamp: '1623238587645',
                    },
                    messageAttributes: {},
                    md5OfBody: '',
                    eventSource: 'aws:sqs',
                    eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:TransferRequeryQueue',
                    awsRegion: 'us-east-1',
                },
            ],
        };

        const context: Context = {} as Context;
        const requeryServiceInstance = new RequeryService();
        const mockProcessMessageAsync = requeryServiceInstance.processMessageAsync as jest.Mock;
        mockProcessMessageAsync.mockResolvedValueOnce(undefined);

        await handler(event, context);

        expect(mockProcessMessageAsync).toHaveBeenCalledTimes(1);
        expect(mockProcessMessageAsync).toHaveBeenCalledWith(JSON.stringify({ key: 'value' }));

        expect(ssmMock.calls()).toHaveLength(1);
        expect(ssmMock).toHaveReceivedCommandWith(GetParameterCommand, {
            Name: '/wallet/TransferRequeryQueueArn',
        });
    });


});
