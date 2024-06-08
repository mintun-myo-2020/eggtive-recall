from typing_extensions import TypedDict, List, Union


class QuestionSchema(TypedDict):
    """
    Represents the base schema for a question in a quiz.

    Attributes:
        question_text (str): The text of the question.
    """

    question_text: str


class MCQQuestionSchema(QuestionSchema):
    """
    Represents the schema for a multiple-choice question in a quiz.

    Attributes:
        options (list[str]): The list of options for the question.
        correct_option (int): The index of the correct option in the options list.
    """

    options: list[str]
    correct_option: int


class OpenEndedQuestionSchema(QuestionSchema):
    """
    Represents the schema for an open-ended question in a quiz.

    Attributes:
        answer (str): The correct answer for the question.
    """

    answer: str


class QuizSchema(TypedDict):
    """
    Represents the schema for a quiz.

    Attributes:
        title (str): The title of the quiz.
        description (str): The description of the quiz.
        questions (List[QuestionSchema]): The list of questions in the quiz.
    """

    title: str
    description: str
    questions: List[Union[MCQQuestionSchema, OpenEndedQuestionSchema]]
