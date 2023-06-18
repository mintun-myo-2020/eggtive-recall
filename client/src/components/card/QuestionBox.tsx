import {
  MouseEventHandler,
  useState,
  useLayoutEffect,
  useRef,
  LegacyRef,
  useEffect,
} from "react";
import { IQuestion } from "../../interfaces/interfaces";

type QuestionBoxProps = {
  id?: string;
  question: IQuestion;
  updateQuestion: (id: string | undefined, newQuestion: IQuestion) => void;
  handleMouseUpCard: MouseEventHandler<HTMLDivElement>;
};
const MIN_TEXTAREA_HEIGHT = 60;

const QuestionBox: React.FC<QuestionBoxProps> = ({
  id,
  question,
  updateQuestion,
  handleMouseUpCard,
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

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
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
      className="max-w-full pl-2 pb-2 bg-inherit text-center rounded-t-md shadow-t-lg border-b border-gray-500"
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUpCard}
    >
      <div className="h-2 my-2"></div>
      {isEditingQuestion ? (
        <div className="text-xl font-semibold">
          <h1 className="pb-2">New Question</h1>
          <div className="flex pr-4 justify-between">
            <h1 className="text-xl mr-2 font-semibold my-auto"> Q: </h1>
            <textarea
              ref={newQuestionTextboxRef}
              className="text-box resize-none rounded w-full py-2.5 px-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300whitespace-pre-line "
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
        <p className="mt-2 font-bold text-2xl break-all hover:cursor-pointer">
          {newQuestion}
        </p>
      )}
    </div>
  );
};

export default QuestionBox;
