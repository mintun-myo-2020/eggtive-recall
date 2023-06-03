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
      className="max-w-full px-10 bg-gradient-to-b to-cyan-400 from-cyan-500 text-center rounded-t-md shadow-t-lg"
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUpCard}
    >
      <div className="h-5 my-2"></div>
      {isEditingQuestion ? (
        <div>
          <h1 className="text-2xl font-semibold"> Question: </h1>
          <textarea
            ref={newQuestionTextboxRef}
            className="text-box resize-none rounded w-full mt-5 px-3 py-2.5 h-4/5"
            value={newQuestion}
            onChange={handleQuestionChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            placeholder="Enter your question here"
            autoFocus
          />
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
