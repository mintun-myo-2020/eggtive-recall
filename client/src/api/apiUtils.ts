import axios from "axios";
import { ICardData } from "../interfaces/interfaces";
import { API_BASE_URL, API_ENDPOINTS } from "./endpoints";

const associateCardToUser = (
  cardId: string | undefined,
  userId: string | undefined
) => {

};

export const createOneCard = async (
  newCard: ICardData
): Promise<ICardData> => {
  try {

    const newCardReq = [newCard]
    const url = API_BASE_URL + API_ENDPOINTS.CARDS;
    const response: any = await axios.post(url, newCardReq);
    const createdCard: ICardData = response.data.cards[0];
    // associateCardToUser(createdCard._id, userId);
    return createdCard;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const saveAllCards = (cards: ICardData[]): void => {
  const url = API_BASE_URL + API_ENDPOINTS.CARDS;

  axios
    .post(url, cards)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const deleteCard = (id: string | undefined): void => {
  const url = API_BASE_URL + API_ENDPOINTS.CARDS;
  axios.delete(url + id);
};
