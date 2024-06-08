import json
import os

from pymongo import MongoClient


db_password = os.getenv("MONGODB_PASSWORD")
db_name = os.getenv("MONGODB_NAME")
mongo_uri = f"mongodb+srv://mintunxdd:{db_password}@active-recall.qrbyadj.mongodb.net/{db_name}?retryWrites=true&w=majority"
client = MongoClient(mongo_uri)


def handler(event, context):
    print("event", event)

    quiz = json.loads(event)

    try:

        database = client["active-recall"]
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
        client.close()
