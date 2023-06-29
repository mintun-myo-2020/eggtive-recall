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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

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

  const [user, loading, error] = useAuthState(auth);
  const userId = user?.uid;

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

  const handleMouseDownCross = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    clickDownX = initialPosition.x;
    clickDownY = initialPosition.y;
    return;
  };

  const handleMouseUpCross = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    if (position.x === clickDownX && position.y === clickDownY) {
      setCards(cards.filter((card) => card._id != id));
      deleteCard(id);

      return;
    } else {
      const currentCard = cards.find((card) => card._id === id) as ICardData;
      const idToken = await user?.getIdToken(true);

      createOneCard(currentCard, idToken);
    }
  };

  const handleMouseUpCard: MouseEventHandler<HTMLDivElement> = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const currentCard = cards.find((card) => card._id === id) as ICardData;
    const idToken = await user?.getIdToken(true);

    createOneCard(currentCard, idToken);

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
        className="min-w-[250px] max-w-xs hover:opacity-95 hover:shadow-md hover:shadow-gray-300 active:shadow-gray-400 active:scale-110  bg-cardLavender absolute rounded font-roboto hover:cursor-move border border-slate-500"
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
