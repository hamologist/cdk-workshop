import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`request: ${JSON.stringify(event, undefined, 2)}`);

    // create AWS SDK clients
    const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    const lambdaClient = new LambdaClient({});

    await documentClient.send(new UpdateCommand({
        TableName: process.env.HITS_TABLE_NAME,
        Key: { 'path': event.path },
        UpdateExpression: 'ADD hits :incr',
        ExpressionAttributeValues: { ':incr': 1 },
    }));

    const resp = await lambdaClient.send(new InvokeCommand({
        FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
        Payload: new TextEncoder().encode(JSON.stringify(event))
    }));

    console.log(`downstream response:`, JSON.stringify(resp, (key, value) => {
        if (key === 'Payload') {
            return new TextDecoder().decode(resp.Payload);
        }

        return value;
    }, 2));

    return {
        statusCode: 200,
        body: new TextDecoder().decode(resp.Payload),
    };
};
