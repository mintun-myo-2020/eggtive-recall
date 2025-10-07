import Draggable from "react-draggable";
import { useState, useEffect } from "react";
import Cross from "./Cross";

import {
  ICardData,
  IPositionData,
  IAnswer,
  IQuestion,
} from "../../../types/types";
import { deleteCard } from "../../../api/cardApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";

type CardProps = {
  id?: string;
  question: IQuestion;
  answer: IAnswer;
  position: IPositionData;
  cards: ICardData[];
  setCards: React.Dispatch<React.SetStateAction<ICardData[]>>;
  updatePosition: (id: string | undefined, position: IPositionData) => void;
  updateQuestion: (id: string | undefined, question: IQuestion) => void;
  updateAnswer: (id: string | undefined, answer: IAnswer) => void;
  zIndex: number;
  bringToFront: (id: string | undefined) => void;
  cancelPendingSave: (id: string | undefined) => void;
};

const Card: React.FC<CardProps> = ({
  id,
  question,
  answer,
  position: initialPosition,
  cards,
  setCards,
  updatePosition,
  updateQuestion,
  updateAnswer,
  zIndex,
  bringToFront,
  cancelPendingSave,
}) => {
  const [user] = useAuthState(auth);
  const [position, setPosition] = useState<IPositionData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAttempt, setUserAttempt] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(question.question === "");
  const [isEditingAnswer, setIsEditingAnswer] = useState(answer.answer === "");
  const [localQuestion, setLocalQuestion] = useState(question.question);
  const [localAnswer, setLocalAnswer] = useState(answer.answer);

  useEffect(() => {
    setPosition({ x: position.x, y: position.y });
  }, [position.x, position.y]);

  const trackPos = (data: IPositionData) => {
    setPosition({ x: data.x, y: data.y });
    updatePosition(id, { x: data.x, y: data.y });
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleDeleteCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Cancel any pending auto-save for this card
    cancelPendingSave(id);
    const idToken = await user?.getIdToken(true);
    // Remove from UI first
    setCards(cards.filter((card) => card._id !== id));
    // Delete from database
    await deleteCard(id, idToken);
  };

  const handleFlip = () => {
    if (!isEditingQuestion && !isEditingAnswer && userAttempt.trim() !== "") {
      setIsFlipped(!isFlipped);
    }
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalQuestion(e.target.value);
    updateQuestion(id, { question: e.target.value });
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalAnswer(e.target.value);
    updateAnswer(id, { answer: e.target.value });
  };

  const handleQuestionBlur = () => {
    if (localQuestion.trim() !== "") {
      setIsEditingQuestion(false);
    }
  };

  const handleAnswerBlur = () => {
    if (localAnswer.trim() !== "") {
      setIsEditingAnswer(false);
      setIsFlipped(false);
    }
  };

  return (
    <Draggable
      key={id}
      bounds="parent"
      cancel=".no-drag"
      position={{ x: position.x, y: position.y }}
      onDrag={(_, data) => trackPos(data)}
      onMouseDown={() => bringToFront(id)}
    >
      <div
        onDoubleClick={handleDoubleClick}
        className="absolute w-80 h-96 hover:cursor-grab active:cursor-grabbing"
        style={{ perspective: "1000px", zIndex }}
      >
        <div className="absolute top-2 right-2 z-50 no-drag">
          <Cross onClick={handleDeleteCard} />
        </div>
        <div
          className={`relative w-full h-full transition-transform duration-700 ${isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card - Question */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-indigo-200 p-6 flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex-1 flex items-center justify-center">
              {isEditingQuestion ? (
                <textarea
                  className="no-drag w-full h-32 p-4 text-xl font-semibold text-gray-800 bg-white rounded-lg border-2 border-indigo-300 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Enter your question..."
                  value={localQuestion}
                  onChange={handleQuestionChange}
                  onBlur={handleQuestionBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && localQuestion.trim() !== "") {
                      e.preventDefault();
                      setIsEditingQuestion(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <p
                  className="text-2xl font-bold text-gray-800 text-center cursor-pointer hover:text-indigo-600"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingQuestion(true);
                  }}
                >
                  {localQuestion}
                </p>
              )}
            </div>

            {!isEditingQuestion && localAnswer.trim() !== "" && (
              <div className="space-y-3">
                <input
                  type="text"
                  className="no-drag w-full px-4 py-3 text-lg bg-white rounded-lg border-2 border-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-400"
                  placeholder="Type your answer..."
                  value={userAttempt}
                  onChange={(e) => setUserAttempt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && userAttempt.trim() !== "") {
                      handleFlip();
                    }
                  }}
                />
                <button
                  onClick={handleFlip}
                  disabled={userAttempt.trim() === ""}
                  className={`no-drag w-full py-3 rounded-lg font-semibold text-white transition-all ${userAttempt.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                    }`}
                >
                  Reveal Answer
                </button>
              </div>
            )}

            {!isEditingQuestion && localAnswer.trim() === "" && (
              <div className="text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingAnswer(true);
                    setIsFlipped(true);
                  }}
                  className="no-drag w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transition-all"
                >
                  Create Answer
                </button>
              </div>
            )}
          </div>

          {/* Back of card - Answer */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl shadow-xl border border-emerald-200 p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="flex-1 flex items-center justify-center">
              {isEditingAnswer ? (
                <textarea
                  className="no-drag w-full h-32 p-4 text-xl font-semibold text-gray-800 bg-white rounded-lg border-2 border-emerald-300 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Enter the correct answer..."
                  value={localAnswer}
                  onChange={handleAnswerChange}
                  onBlur={handleAnswerBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && localAnswer.trim() !== "") {
                      e.preventDefault();
                      setIsEditingAnswer(false);
                      setIsFlipped(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600 font-medium">Your attempt:</p>
                  <p className="text-lg text-gray-700 italic">{userAttempt}</p>
                  <div className="border-t-2 border-emerald-300 pt-4">
                    <p className="text-sm text-gray-600 font-medium mb-2">Correct answer:</p>
                    <p
                      className="text-3xl font-bold text-emerald-600 cursor-pointer hover:text-emerald-700"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setIsEditingAnswer(true);
                      }}
                    >
                      {localAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isEditingAnswer && (
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setUserAttempt("");
                }}
                className="no-drag w-full py-3 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transition-all"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Card;
