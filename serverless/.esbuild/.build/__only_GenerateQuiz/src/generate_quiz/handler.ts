import { APIGatewayProxyEventV2, Context, Handler } from "aws-lambda";
import { QuizSchema } from "./quizSchema";
import path from "path";
import fs from "fs";
import { createTypeScriptJsonValidator } from "typechat/ts";
import {
  createJsonTranslator,
  createLanguageModel,
  createOpenAILanguageModel,
} from "typechat";
import { processRequests } from "typechat/interactive";

interface Body {
  noteHtml: string;
}

const model = createOpenAILanguageModel(
  process.env.OPENAI_API_KEY || "",
  "gpt-3.5-turbo"
);
const schema = fs.readFileSync(path.join(__dirname, "quizSchema.ts"), "utf8");
const validator = createTypeScriptJsonValidator<QuizSchema>(
  schema,
  "QuizSchema"
);
const translator = createJsonTranslator(model, validator);

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  const body: Body = JSON.parse(event.body || "{}");
  const prompt = translator.createRequestPrompt(
    "Generate a quiz with 5 questions in the JSON format. The quiz should be based only on the content of the text. There should be 5 questions in the quiz. The questions should be in a JSON list"
  );
  const result = await translator.translate(body.noteHtml);

  return {
    statusCode: 200,
    body: JSON.stringify({
      quiz: result,
    }),
  };
};
