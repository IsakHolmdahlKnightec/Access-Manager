/**
 * Process DynamoDB Stream event
 */
export declare const handler: (event: {
    Records: Array<{
        eventName: string;
        dynamodb: {
            NewImage?: Record<string, {
                [key: string]: unknown;
            }>;
            OldImage?: Record<string, {
                [key: string]: unknown;
            }>;
        };
    }>;
}) => Promise<void>;
//# sourceMappingURL=streamHandler.d.ts.map