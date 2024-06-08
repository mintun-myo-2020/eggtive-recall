import json
import os
from openai import OpenAI

from src.exceptions.quiz_empty_exception import QuizEmptyError

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def handler(event, context):
    note_html = event.get("noteHtml")
    user_id = event.get("userId")
    chat_completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "You are a quiz generating expert that takes in a note and generates a quiz JSON object (main key is quiz) with the subkeys being question and answer.",
            },
            {
                "role": "user",
                "content": note_html,
            },
        ],
    )

    try:
        quiz_content = chat_completion.choices[0].message.content
        quiz = json.loads(quiz_content).get("quiz")

        if not quiz or len(quiz) == 0:
            raise Exception("Quiz is empty")

        return {
            "statusCode": 200,
            "body": json.dumps({"quiz": quiz, "userId": user_id}),
        }
    except QuizEmptyError as error:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(error), "type": "QuizEmptyError"}),
        }
    except Exception as error:
        return {"statusCode": 500, "body": json.dumps({"error": str(error)})}
