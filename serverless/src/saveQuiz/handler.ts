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
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  const body: QuizSchema = JSON.parse(event.body || "{}");

  const quiz = {
    userId: body.userId,
    quiz: body.quiz, // the questions from the quiz
  };

  try {
    await client.connect();
    const database = client.db("active-recall"); // replace with your database name
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
