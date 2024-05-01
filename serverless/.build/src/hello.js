export const handler = async (event, context) => {
    const body = JSON.parse(event.body || '{}');
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World!',
            input: event,
            inputBody: body,
        }),
    };
};
//# sourceMappingURL=hello.js.map