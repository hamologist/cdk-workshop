import { APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent) => {
  console.log(`request: ${JSON.stringify(event, undefined, 2)}`);
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Good Afternoon, CDK!!! You've hit ${event.path}\n`,
  };
};