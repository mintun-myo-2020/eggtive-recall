import QuestionBox from "./QuestionBox";
import AnswerBox from "./AnswerBox";
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
}) => {
  const [user] = useAuthState(auth);

  const [position, setPosition] = useState<IPositionData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });

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

  const handleDeleteCard = async () => {
    const idToken = await user?.getIdToken(true);
    setCards(cards.filter((card) => card._id !== id));
    deleteCard(id, idToken);
  };

  return (
    <Draggable
      key={id}
      bounds="parent"
      cancel=".text-box"
      position={{ x: position.x, y: position.y }}
      onDrag={(e, data) => trackPos(data)}
    >
      <div
        onDoubleClick={handleDoubleClick}
        className="min-w-[250px] max-w-xs hover:opacity-95 hover:shadow-md hover:shadow-gray-300 active:shadow-gray-400 active:scale-110 bg-cardLavender absolute rounded font-roboto hover:cursor-grab active:cursor-grabbing border border-slate-500"
      >
        <Cross onClick={handleDeleteCard} />
        <QuestionBox
          id={id}
          question={question}
          updateQuestion={updateQuestion}
        />
        <AnswerBox
          answer={answer}
          updateAnswer={updateAnswer}
          id={id}
        />
      </div>
    </Draggable>
  );
};

export default Card;
