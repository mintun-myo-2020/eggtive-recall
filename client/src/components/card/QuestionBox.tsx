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
  updateQuestion: (id: string|undefined, newQuestion: IQuestion) => void;
  handleMouseUpCard: MouseEventHandler<HTMLDivElement>;
};
const MIN_TEXTAREA_HEIGHT = 32;

const QuestionBox: React.FC<QuestionBoxProps> = ({
  id,
  question,
  updateQuestion,
  handleMouseUpCard
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
      className="p-5 bg-gradient-to-b from-sky-500 text-center"
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUpCard}
    >
      <h1 className="text-xl font-bold hover:cursor-pointer">Question: </h1>
      {isEditingQuestion ? (
        <textarea
          ref={newQuestionTextboxRef}
          className="text-box resize-none rounded w-4/5 ml-5 mt-2 indent-2"
          value={newQuestion}
          onChange={handleQuestionChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyPress}
          placeholder="Enter your question here"
          autoFocus
        />
      ) : (
        <p className="mt-2  hover:cursor-pointer">{newQuestion}</p>
      )}
    </div>
  );
};

export default QuestionBox;
