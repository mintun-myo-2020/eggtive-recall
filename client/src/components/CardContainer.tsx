import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Card from "./card/Card";
import {
  IAnswer,
  ICardData,
  IPositionData,
  IQuestion,
} from "../interfaces/interfaces";
import { createCard } from "../api/apiUtils";

type CardContainerProps = {
  cards: ICardData[];
  setCards: React.Dispatch<React.SetStateAction<ICardData[]>>;
  isEmpty: boolean;
};

const CardContainer: React.FC<CardContainerProps> = ({
  cards,
  setCards,
  isEmpty,
}) => {
  const CardContainerRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const x = event.clientX - 150;
    const y = event.clientY - 85;

    const newCard: ICardData[] = [
      {
        question: { question: "" },
        answer: { answer: "" },
        position: {
          x: x,
          y: y,
        },
      },
    ];
    const createdCard: ICardData = await createCard(newCard);
    setCards((prevCards) => [...prevCards, createdCard]);
  };

  const handleUpdateQuestion = (
    id: string | undefined,
    question: IQuestion
  ) => {
    const updatedCards = cards.map((card) =>
      card._id === id ? { ...card, question: question } : card
    );
    setCards(updatedCards);
    const currentCard = updatedCards.find((card) => card._id === id) as ICardData;
    createCard([currentCard]);
  };
  const handleUpdateAnswer = (id: string | undefined, answer: IAnswer) => {
    const updatedCards = cards.map((card) =>
      card._id === id ? { ...card, answer: answer } : card
    );
    setCards(updatedCards);
    const currentCard = updatedCards.find((card) => card._id === id) as ICardData;
    createCard([currentCard]);
  };

  const handleUpdatePosition = (
    id: string | undefined,
    position: IPositionData
  ) => {
    const updatedCards = cards.map((card) =>
      card._id === id ? { ...card, position: position } : card
    );
    setCards(updatedCards);
  };

  if (isEmpty) {
    return (
      <div onDoubleClick={handleDoubleClick}>
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <p className="text-lg text-gray-500 capitalize">
            Double Click On Screen To Get Started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={CardContainerRef}
      className="relative w-full h-screen bg-gray-100"
      onDoubleClick={handleDoubleClick}
    >
      {cards.map((card) => (
        <Card
          key={card._id}
          id={card._id}
          question={card.question}
          answer={card.answer}
          position={card.position}
          cards={cards}
          setCards={setCards}
          updatePosition={handleUpdatePosition}
          updateQuestion={handleUpdateQuestion}
          updateAnswer={handleUpdateAnswer}
        />
      ))}
    </div>
  );
};

export default CardContainer;
