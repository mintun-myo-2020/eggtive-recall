import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  MouseEventHandler,
} from "react";
import { IAnswer } from "../../interfaces/interfaces";

type AnswerBoxProps = {
  answer: IAnswer;
  id?: string;
  updateAnswer: (id: string | undefined, answer: IAnswer) => void;
  handleMouseUpCard: MouseEventHandler<HTMLDivElement>;
};
const MIN_TEXTAREA_HEIGHT = 32;

const AnswerBox: React.FC<AnswerBoxProps> = ({
  answer: answer,
  id: id,
  updateAnswer: updateAnswer,
  handleMouseUpCard: handleMouseUpCard,
}) => {
  const newAnswerTextboxRef = useRef<HTMLTextAreaElement>(null);

  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [remainingTries, setRemainingTries] = useState(5);
  const [newAnswer, setNewAnswer] = useState(answer.answer);

  useEffect(() => {
    if (answer.answer === "") {
      setIsEditingAnswer(true);
      setIsAnswerRevealed(true);
    }
  }, []);

  useEffect(() => {
    updateAnswer(id, { answer: newAnswer });
  }, [newAnswer]);

  useLayoutEffect(() => {
    if (newAnswerTextboxRef.current) {
      newAnswerTextboxRef.current.style.height = "inherit";
      newAnswerTextboxRef.current.style.height = `${Math.max(
        newAnswerTextboxRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [newAnswer]);

  const handleEditAnswer = () => {
    if (newAnswer !== "") {
      setIsEditingAnswer(!isEditingAnswer);
    }
  };

  const handleShowAnswer = (answerSubmission: string) => {
    setIsAnswerRevealed(!isAnswerRevealed);
    setRemainingTries(0);
  };

  const hideAnswer = () => {
    setIsAnswerRevealed(false);
  };

  const handleEnterAttempt = (
    event: React.KeyboardEvent<HTMLInputElement>,
    answerSubmission: string
  ) => {
    if (event.key === "Enter") {
      if (answerSubmission.toLowerCase() === answer.answer.toLowerCase()) {
        setIsAnswerRevealed(!isAnswerRevealed);
      } else {
        if (remainingTries > 0)
          setRemainingTries((oldRemainingTries) => oldRemainingTries - 1);
      }
    }
  };
  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewAnswer(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" || event.key === "Escape") {
      if (newAnswer !== "") {
        setIsEditingAnswer(false);
        setIsAnswerRevealed(false);
      }
    }
  };
  const handleBlur = () => {
    if (newAnswer !== "") {
      setIsEditingAnswer(false);
      setIsAnswerRevealed(false);
    }
  };
  useEffect(() => {
    if (remainingTries <= 0) {
      setIsAnswerRevealed(true);
    }
  }, [remainingTries]);

  return (
    <div
      onMouseUp={handleMouseUpCard}
      className="pb-2 px-10 via-30% bg-gradient-to-b to-cyan-500 from-cyan-400 rounded-b-md text-center shadow-t-lg"
    >
      <label htmlFor="answerSubmission">Answer:</label>
      <input
        type="text"
        name="answerSubmission"
        placeholder="Attempt"
        onKeyDown={(event) => {
          handleEnterAttempt(event, event.currentTarget.value);
          setAttempt(event.currentTarget.value);
        }}
        className="
        rounded
        text-box
        ml-2
        ring-1 ring-inset ring-gray-300
        placeholder:text-gray-400 placeholder:pl-1         
        focus:ring-2 focus:ring-inset focus:ring-indigo-100
        pl-2
        py-1
        "
      />
      {isAnswerRevealed && isEditingAnswer && (
        <div>
          <div className="opacity-50 mt-2 bg-black bg-opacity-50 flex items-center justify-center cursor-not-allowed">
            <div className="text-white text-center">Click to hide answer</div>
          </div>
          <textarea
            placeholder="Enter correct answer here"
            ref={newAnswerTextboxRef}
            className="px-3 py-2.5 text-box resize-none w-11/12 rounded mt-5 whitespace-pre-line"
            value={newAnswer}
            onChange={handleAnswerChange}
            onKeyDown={handleKeyPress}
            onBlur={handleBlur}
          />

          <div
            onClick={handleEditAnswer}
            className="w-2/4 my-1 mx-auto py-1 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer "
          >
            <div className="text-white text-center">Edit answer</div>
          </div>
        </div>
      )}
      {isAnswerRevealed && !isEditingAnswer && (
        <div>
          <div
            className="mt-2 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
            onClick={hideAnswer}
          >
            <div className="text-white text-center">Click to hide answer</div>
          </div>
          <p onDoubleClick={handleEditAnswer} className="mt-2 font-bold text-xl">
            {newAnswer}
          </p>
          <div
            onClick={handleEditAnswer}
            className="w-2/4 my-1 mx-auto py-1 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer "
          >
            <div className="text-white text-center">Edit answer</div>
          </div>
        </div>
      )}
      {!isAnswerRevealed && (
        <div
          className="mt-2 rounded bg-black bg-opacity-50 flex items-center justify-center cursor-pointer max-w-xs"
          onClick={(event) => handleShowAnswer(attempt)}
        >
          <div className="text-white text-center ">Click to reveal answer</div>
        </div>
      )}
      <div className="my-5">
        <p>Number of tries left: {remainingTries}</p>
      </div>
    </div>
  );
};

export default AnswerBox;
