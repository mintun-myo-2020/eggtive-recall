import path from "path";
import fs from "fs";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { createJsonTranslator, createOpenAILanguageModel, } from "typechat";
const model = createOpenAILanguageModel(process.env.OPENAI_API_KEY || "", "gpt-3.5-turbo");
const schema = fs.readFileSync(path.join(__dirname, "quizSchema.ts"), "utf8");
const validator = createTypeScriptJsonValidator(schema, "QuizSchema");
const translator = createJsonTranslator(model, validator);
export const handler = async (event, context) => {
    const body = JSON.parse(event.body || "{}");
    const prompt = translator.createRequestPrompt("Generate a quiz with 5 questions in the JSON format. The quiz should be based only on the content of the text. There should be 5 questions in the quiz. The questions should be in a JSON list");
    const result = await translator.translate(body.noteHtml);
    return {
        statusCode: 200,
        body: JSON.stringify({
            quiz: result,
        }),
    };
};
//# sourceMappingURL=handler.js.map