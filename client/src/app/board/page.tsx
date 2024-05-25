"use client";
import { useEffect, useState } from "react";

import { Spinner } from "flowbite-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ICardData } from "@/__types/types";
import { getUserCards } from "@/utils/api/cardApiUtils";
import CardContainer from "@/board/components/container/CardContainer";
import { auth } from "@/utils/firebase";

const Board = () => {
  const [user, loading, error] = useAuthState(auth);

  const [cards, setCards] = useState<ICardData[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToken = await user?.getIdToken();
        const userId = await user?.uid;
        const cards = await getUserCards(userId, idToken);
        if (cards === undefined || cards === null) {
          setIsEmpty(true);
          setCards([]);
        } else {
          setCards(cards);
        }
        setIsPageLoading(false);
      } catch (err) {
        console.error(err);
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [loading, user]);

  useEffect(() => {
    if (cards.length !== 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [cards]);

  if (isPageLoading) {
    return (
      <div className="Eggtive">
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <Spinner />
          <p className="text-lg text-gray-500 ">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Eggtive ">
      <div className="overflow-auto">
        <CardContainer cards={cards} setCards={setCards} isEmpty={isEmpty} />
      </div>
    </div>
  );
};

export default Board;
