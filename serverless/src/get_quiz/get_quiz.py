import json

from bson import ObjectId
from src.utils.mongodb import create_mongo_client
from bson.json_util import dumps

mongo_client = create_mongo_client()
quizzes_collection = mongo_client["active-recall"]["quizzes"]


def handler(event, context):

    print("event", event)

    user_id = event["headers"].get("userId")
    quiz_id = event["pathParameters"].get("quizId")

    object_id = ObjectId(quiz_id)
    quiz = quizzes_collection.find_one({"_id": object_id})
    if quiz and quiz.get("userId") != user_id:
        return {"statusCode": 403, "body": "Unauthorized"}

    response_body = {"quiz": quiz}

    print(response_body)

    return {"statusCode": 200, "body": dumps(response_body)}
