import { Handler, APIGatewayProxyEventV2, Context } from "aws-lambda";
import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const handler: Handler = async (
  event: GenerateQuizEvent,
  context: Context
) => {


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
        content: event.noteHtml,
      },
    ],
  });


  try {
    const quizContent = chatCompletion.choices[0].message.content || "{}";
    const quiz = JSON.parse(quizContent).quiz;
    const userId = event.userId;

    if (!quiz || quiz.length === 0) {
      throw new QuizEmptyError("Quiz is empty");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        quiz,
        userId,
      }),
    };
  } catch (error) {
    if (error instanceof QuizEmptyError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message,
          type: 'QuizEmptyError',
        }),
      };
    }

    // Other types of errors
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: (error as Error).message,
      }),
    };
  }
};
