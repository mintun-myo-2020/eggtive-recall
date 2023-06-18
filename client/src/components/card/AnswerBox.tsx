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
  const attemptInputRef = useRef<HTMLInputElement>(null);

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
        if (attemptInputRef.current != null) {
          console.log(attemptInputRef.current)
          attemptInputRef.current.classList.add("ring-2", "ring-rose-600", "focus:ring-rose-600", "border-2", "border-rose-600");
          attemptInputRef.current.classList.remove("focus:ring-indigo-100");
        }
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
      className="pt-2 pb-1  bg-inherit rounded-b-md text-center shadow-t-lg"
    >
      {isAnswerRevealed && isEditingAnswer && (
        <div>
          <div className="flex pr-4 justify-between">
            <h1 className="text-xl pl-2 mr-2 font-semibold my-auto"> A: </h1>
            <textarea
              placeholder="Enter correct answer here"
              ref={newAnswerTextboxRef}
              className="pl-3 pr-4 py-2.5 text-box resize-none rounded my-5 w-full"
              value={newAnswer}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyPress}
              onBlur={handleBlur}
            />
          </div>
        </div>
      )}
      {isAnswerRevealed && !isEditingAnswer && (
        <div className="pt-3">
          <p onDoubleClick={handleEditAnswer} className="font-bold text-3xl text-emerald-500">
            A: {newAnswer}
          </p>
          <button
            onClick={handleEditAnswer}
            className="answerBtn"
          >
            <div className="text-white text-center">Edit answer</div>
          </button>
          <button
            className="answerBtn"
            onClick={hideAnswer}
          >
            <div className="text-white text-center">Hide Answer</div>
          </button>
        </div>
      )}
      {!isAnswerRevealed && (
        <div>
          <div className="rounded bg-opacity-50 flex items-center justify-center cursor-pointer max-w-xs">
            <label
              htmlFor="answerSubmission"
              className="text-xl mr-2 font-semibold my-auto"
            >
              A:
            </label>
            <input
              type="text"
              name="answerSubmission"
              placeholder="Attempt"
              onKeyDown={(event) => {
                handleEnterAttempt(event, event.currentTarget.value);
                setAttempt(event.currentTarget.value);
              }}
              ref={attemptInputRef}
              className="rounded outline-none focus:outline-2 focus:outline-gray-600 text-box ml-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:pl-1 focus:ring-2 focus:ring-inset focus:ring-indigo-100 pl-2 py-1 "
            />
          </div>
          <button
            onClick={(event) => handleShowAnswer(attempt)}
            className="answerBtn"
          >
            <div className="text-white text-center">Click to reveal answer</div>
          </button>
        </div>
      )}
      {/* <div className="my-5">
        <p>Number of tries left: {remainingTries}</p>
      </div> */}
    </div>
  );
};

export default AnswerBox;
