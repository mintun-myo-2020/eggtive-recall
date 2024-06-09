import json
import os

from pymongo import MongoClient

from src.utils.mongodb import create_mongo_client


mongo_client = create_mongo_client()


def handler(event, context):
    print("event", event)

    quiz = json.loads(event)

    try:

        database = mongo_client["active-recall"]
        collection = database["quizzes"]
        collection.insert_one(quiz)

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Quiz saved successfully",
                    "quiz": quiz["quiz"],
                }
            ),
        }
    except Exception as error:
        print(error)

        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "message": "Could not save quiz",
                }
            ),
        }
    finally:
        mongo_client.close()
