from src.utils.mongodb import create_mongo_client
from bson.json_util import dumps


mongo_client = create_mongo_client()
quizzes_collection = mongo_client["active-recall"]["quizzes"]


def handler(event, context):

    print("event", event)
    user_id = event["headers"].get("userId")

    quizzes = []
    for quiz in quizzes_collection.find({"userId": user_id}):
        quizzes.append(quiz)

    response_body = {"quizzes": quizzes}

    return {"statusCode": 200, "body": dumps(response_body)}
