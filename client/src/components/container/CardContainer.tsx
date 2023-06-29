import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Card from "../card/Card";
import {
  IAnswer,
  ICardData,
  IPositionData,
  IQuestion,
} from "../../interfaces/interfaces";
import { createOneCard } from "../../api/apiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

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
  const [user, loading, error] = useAuthState(auth);
  const userId = user?.uid;

  const CardContainerRef = useRef<HTMLDivElement>(null);

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const x = event.clientX - 150;
    const y = event.clientY - 85;
    const idToken = await user?.getIdToken(true);

    const newCard: ICardData = {
      userId: userId,
      question: { question: "" },
      answer: { answer: "" },
      position: {
        x: x,
        y: y,
      },
    };
    const createdCard: ICardData = await createOneCard(newCard, idToken);
    setCards((prevCards) => [...prevCards, createdCard]);
  };

  const handleUpdateQuestion = async (
    id: string | undefined,
    question: IQuestion
  ) => {
    const updatedCards = cards.map((card) =>
      card._id === id ? { ...card, question: question } : card
    );
    const idToken = await user?.getIdToken(true);

    setCards(updatedCards);
    const currentCard = updatedCards.find(
      (card) => card._id === id
    ) as ICardData;
    createOneCard(currentCard, idToken);
  };
  const handleUpdateAnswer = async (id: string | undefined, answer: IAnswer) => {
    const updatedCards = cards.map((card) =>
      card._id === id ? { ...card, answer: answer } : card
    );
    const idToken = await user?.getIdToken(true);

    setCards(updatedCards);
    const currentCard = updatedCards.find(
      (card) => card._id === id
    ) as ICardData;
    createOneCard(currentCard, idToken);
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

  // FUTURE IMPLEMENTATION OF UPDATING CONTAINER SIZE

  const updateContainerSize = () => {
    let maxWidth = screen.width;
    let maxHeight = screen.height;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const { position } = card;
      const { x, y } = position;

      if (x + 500 > maxWidth) {
        maxWidth = x + 500;
      }
      if (y + 850 > maxHeight) {
        maxHeight = y + 850;
      }
    }
    if (CardContainerRef.current) {
      CardContainerRef.current.style.width = `${maxWidth}px`;
      CardContainerRef.current.style.height = `${maxHeight}px`;
    }
  };

  useEffect(() => {
    updateContainerSize();
  }, [cards]);

  if (isEmpty) {
    return (
      <div onDoubleClick={handleDoubleClick}>
        <div className="flex justify-center items-center h-screen bg-bgGray">
          <p className="text-lg text-gray-500 capitalize select-none font-oxygen">
            Double Click On Screen To Get Started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={CardContainerRef}
      className="relative w-full h-screen bg-bgGray"
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
