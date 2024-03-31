import { APIGatewayProxyEventV2, Context, Handler } from "aws-lambda";


export const handler: Handler = async (event: APIGatewayProxyEventV2, context: Context) => {

    const body = JSON.parse(event.body || '{}');
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World!',
            input: event,
            inputBody: body,
        }),
    };
}