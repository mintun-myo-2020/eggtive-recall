import QuestionBox from "./QuestionBox";
import AnswerBox from "./AnswerBox";
import Draggable from "react-draggable";
import { useState, MouseEventHandler, useEffect } from "react";
import Cross from "./Cross";

import {
  ICardData,
  IPositionData,
  IAnswer,
  IQuestion,
} from "../../interfaces/interfaces";
import { createCard, deleteCard } from "../../api/apiUtils";

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
  id: id,
  question: question,
  answer: answer,
  position: initialPosition,
  cards: cards,
  setCards: setCards,
  updatePosition: updatePosition,
  updateQuestion: updateQuestion,
  updateAnswer: updateAnswer,
}) => {
  const [position, setPosition] = useState<IPositionData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });

  let clickDownX: number;
  let clickDownY: number;

  useEffect(() => {
    setPosition({ x: position.x, y: position.y });
  }, [position.x, position.y]);

  const trackPos = (data: IPositionData) => {
    setPosition({ x: data.x, y: data.y });
    updatePosition(id, { x: data.x, y: data.y });
  };

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log("doubleclick");
    event.stopPropagation();
  };

  const handleMouseDownCross: MouseEventHandler<SVGSVGElement> = (
    e: React.MouseEvent<SVGSVGElement>
  ) => {
    clickDownX = initialPosition.x;
    clickDownY = initialPosition.y;
    return;
  };

  const handleMouseUpCross: MouseEventHandler<SVGSVGElement> = (
    e: React.MouseEvent<SVGSVGElement>
  ) => {
    if (position.x === clickDownX && position.y === clickDownY) {
      // TODO: delete the card
      setCards(cards.filter((card) => card._id != id));
      deleteCard(id);

      return;
    } else {
      const currentCard = cards.find((card) => card._id === id) as ICardData;
      createCard([currentCard]);
    }
  };

  const handleMouseUpCard: MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentCard = cards.find((card) => card._id === id) as ICardData;
    createCard([currentCard]);

    return;
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
        onMouseUp={handleMouseUpCard}
        className="max-w-sm absolute bg-green-200 m-2 rounded shadow-md border font-roboto hover:cursor-move"
      >
        <Cross
          onMouseDown={handleMouseDownCross}
          onMouseUp={handleMouseUpCross}
        />
        <QuestionBox
          id={id}
          question={question}
          updateQuestion={updateQuestion}
          handleMouseUpCard={handleMouseUpCard}
        />
        <AnswerBox
          answer={answer}
          updateAnswer={updateAnswer}
          id={id}
          handleMouseUpCard={handleMouseUpCard}
        />
      </div>
    </Draggable>
  );
};

export default Card;
