import json
import os
from pymongo import MongoClient
from bson import json_util


def create_mongo_client():
    try:
        db_password = os.getenv("MONGODB_PASSWORD")
        db_name = os.getenv("MONGODB_NAME")
        mongo_uri = f"mongodb+srv://mintunxdd:{db_password}@active-recall.qrbyadj.mongodb.net/{db_name}?retryWrites=true&w=majority"
        client = MongoClient(mongo_uri)
        return client
    except Exception as e:
        print(e)
        return None


def parse_json(data):
    return json.loads(json_util.dumps(data))
