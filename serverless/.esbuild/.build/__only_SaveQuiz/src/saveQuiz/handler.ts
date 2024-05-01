import { Handler, APIGatewayProxyEventV2, Context } from "aws-lambda";
import { MongoClient } from "mongodb";
import { QuizSchema } from "./quizSchema";
import * as dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI; // Connection string for your MongoDB database
const client = new MongoClient(uri || "");

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
) => {
  const body: QuizSchema = JSON.parse(event.body || "{}");

  const quiz = {
    userId: body.quiz.userId,
    questions: body.quiz.questions, // the questions from the quiz
  };

  try {
    await client.connect();
    const database = client.db("quizDB"); // replace with your database name
    const collection = database.collection("quizzes"); 
    await collection.insertOne(quiz);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Quiz saved successfully",
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
