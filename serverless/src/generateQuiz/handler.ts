import { Handler, APIGatewayProxyEventV2, Context } from "aws-lambda";
import OpenAI from "openai";


interface Body {
  noteHtml: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  const body: Body = JSON.parse(event.body || "{}");

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { "type": "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a quiz generating expert that takes in a note and generates a quiz JSON object (main key is quiz) with the subkeys being question and answer.",
      },
      {
        role: "user",
        content: body.noteHtml,
      },
    ],
  });


  const quizContent = chatCompletion.choices[0].message.content || "{}";
  const quiz = JSON.parse(quizContent).quiz;

  return {
    statusCode: 200,
    body: JSON.stringify({
      quiz,
    }),
  };
};
