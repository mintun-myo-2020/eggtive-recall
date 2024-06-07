import { Handler, APIGatewayProxyEventV2, Context } from "aws-lambda";
import { MongoClient } from "mongodb";
import { QuizSchema } from "./quizSchema";
import * as dotenv from "dotenv";

dotenv.config();

const dbPassword = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_NAME;
const mongoURI = `mongodb+srv://mintunxdd:${dbPassword}@active-recall.qrbyadj.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(mongoURI || "");

export const handler: Handler = async (
  event: string,
  context: Context
) => {

  console.log("event", event);

  const quiz: QuizSchema = JSON.parse(event);

  try {
    await client.connect();
    const database = client.db("active-recall");
    const collection = database.collection("quizzes");
    await collection.insertOne(quiz);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Quiz saved successfully",
        quiz: quiz.quiz,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Could not save quiz",
      }),
    };
  } finally {
    await client.close();
  }
};
