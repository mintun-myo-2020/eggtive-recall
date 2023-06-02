import QuestionBox from "./QuestionBox";
import AnswerBox from "./AnswerBox";
import Draggable from "react-draggable";
import { useState, MouseEventHandler, useEffect, useRef } from "react";
import Cross from "./Cross";

import {
  ICardData,
  IPositionData,
  IAnswer,
  IQuestion,
} from "../../interfaces/interfaces";
import { createOneCard, deleteCard } from "../../api/apiUtils";

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
  const cardRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<IPositionData>({
    x: initialPosition.x,
    y: initialPosition.y,
  });

  let clickDownX: number;
  let clickDownY: number;

  useEffect(() => {
    setPosition({ x: position.x, y: position.y });
  }, [position.x, position.y]);

  //TODO: future implementation of dynamic container scrolling
  // useEffect(() => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     console.log("X: ", event.clientX)
  //     console.log("Y: ", event.clientY)
  //     const container = cardRef.current?.parentElement;
  //     if (container) {
  //       const scrollDistance = 10;

  //       // Scroll right if the mouse is near the right edge of the container
  //       if (event.clientX > container.clientWidth) {
  //         console.log(event.clientX);
  //         container.parentElement?.scrollBy({
  //           left: scrollDistance,
  //           behavior: "smooth",
  //         });
  //       }

  //       // Scroll bottom if the mouse is near the bottom edge of the container
  //       if (event.clientY > 950) {
  //         console.log(event.clientY);

  //         container.parentElement?.scrollBy({
  //           top: scrollDistance,
  //           behavior: "smooth",
  //         });
  //       }
  //     }
  //   };

  //   const cardElement = cardRef.current;
  //   if (cardElement) {
  //     cardElement.addEventListener("mousemove", handleMouseMove);
  //   }

  //   return () => {
  //     if (cardElement) {
  //       cardElement.removeEventListener("mousemove", handleMouseMove);
  //     }
  //   };
  // }, [cards]);

  const trackPos = (data: IPositionData) => {
    setPosition({ x: data.x, y: data.y });
    updatePosition(id, { x: data.x, y: data.y });
  };

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
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
      createOneCard([currentCard]);
    }
  };

  const handleMouseUpCard: MouseEventHandler<HTMLDivElement> = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentCard = cards.find((card) => card._id === id) as ICardData;
    createOneCard([currentCard]);

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
        ref={cardRef}
        className="max-w-sm hover:opacity-90 bg-transparent absolute rounded font-roboto hover:cursor-move"
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
