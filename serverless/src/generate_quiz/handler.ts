import { APIGatewayProxyEventV2, Context, Handler } from "aws-lambda";
import * as typechat from "typechat";
import { QuizSchema } from "./quizSchema";
import path from "path";
import fs from "fs";

interface Body {
    noteHtml: string;
}

const model = typechat.createOpenAILanguageModel(
    process.env.OPENAI_API_KEY || "",
    "gpt-3.5-turbo",
    "chat"
);

const schema = fs.readFileSync(path.join(__dirname, "quizSchema.ts"), "utf8");
const translator = typechat.createJsonTranslator<QuizSchema>(model, schema);


export const handler: Handler = async (event: APIGatewayProxyEventV2, context: Context) => {

    const body: Body = JSON.parse(event.body || '{}');

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "You are a quiz generator that takes in a note and creates a quiz that consists of 5 questions. The questions should be in the JSON format with question (string), options (object with option a,b,c,d as keys) and correctOption. Only return with the json object, starting and ending the response with { and } respectively."
            },
        ],
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const content = response.choices[0].message.content;
    const quiz = content ? JSON.parse(content) : null;

    return {
        statusCode: 200,
        body: JSON.stringify({
            quiz: quiz,
        }),
    };
}