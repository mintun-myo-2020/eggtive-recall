import {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import { IQuestion } from "../../../types/types";

type QuestionBoxProps = {
  id?: string;
  question: IQuestion;
  updateQuestion: (id: string | undefined, newQuestion: IQuestion) => void;
};
const MIN_TEXTAREA_HEIGHT = 60;

const QuestionBox: React.FC<QuestionBoxProps> = ({
  id,
  question,
  updateQuestion,
}) => {
  const newQuestionTextboxRef = useRef<HTMLTextAreaElement>(null);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState(question.question);

  useEffect(() => {
    if (question.question.trim() == "") setIsEditingQuestion(true);
    else setIsEditingQuestion(false);
  }, []);

  useEffect(() => {
    updateQuestion(id, { question: newQuestion });
  }, [newQuestion]);

  useLayoutEffect(() => {
    if (newQuestionTextboxRef.current) {
      newQuestionTextboxRef.current.style.height = "inherit";
      newQuestionTextboxRef.current.style.height = `${Math.max(
        newQuestionTextboxRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [newQuestion]);

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewQuestion(event.target.value);
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsEditingQuestion(true);
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      if (newQuestion.trim() != "") setIsEditingQuestion(false);
    }
  };
  const handleBlur = () => {
    if (newQuestion.trim() !== "") setIsEditingQuestion(false);
  };

  return (
    <div
      className="w-full pl-2 pb-2 bg-inherit text-center rounded-t-md shadow-t-lg border-b border-gray-500"
      onDoubleClick={handleDoubleClick}
    >
      <div className="h-2 my-2"></div>
      {isEditingQuestion ? (
        <div className="text-xl font-semibold">
          <h1 className="pb-2">New Question</h1>
          <div className="flex pr-4 justify-between">
            <h1 className="text-xl mr-2 font-semibold my-auto"> Q: </h1>
            <textarea
              ref={newQuestionTextboxRef}
              className="text-box resize-none rounded w-full py-2.5 px-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 whitespace-pre-line "
              value={newQuestion}
              onChange={handleQuestionChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question here"
              autoFocus
            />
          </div>
        </div>
      ) : (
        <p className="mt-2 pr-2 break-after-auto font-bold text-2xl hover:cursor-pointer">
          {newQuestion}
        </p>
      )}
    </div>
  );
};

export default QuestionBox;
