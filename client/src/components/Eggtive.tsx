import { useEffect, useState } from "react";
import CardContainer from "./container/CardContainer";
import axios from "axios";
import { ICardData } from "../interfaces/interfaces";
import { API_BASE_URL, API_ENDPOINTS } from "../api/endpoints";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const Eggtive = () => {
  const [user, loading, error] = useAuthState(auth);
  const cardURL = API_BASE_URL + API_ENDPOINTS.CARDS + user?.uid;

  const [cards, setCards] = useState<ICardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(cardURL)
      .then((res) => {
        if (res.data === null) {
          setIsEmpty(true);
          setCards(new Array<ICardData>());
        } else {
          setCards(res.data);
        }
        setIsLoading(false);

      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [loading, user]);

  useEffect(() => {
    if (cards.length !== 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [cards]);

  if (isLoading) {
    return (
      <div className="Eggtive">
        <div className="flex justify-center items-center h-screen bg-gray-100">
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

export default Eggtive;
