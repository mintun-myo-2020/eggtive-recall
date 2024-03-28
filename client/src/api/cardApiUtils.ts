import axios from "axios";
import { ICardData } from "../types/types";
import { API_BASE_URL, API_ENDPOINTS } from "./endpoints";

const associateCardToUser = (
  cardId: string | undefined,
  userId: string | undefined
) => {};

export const getUserCards = async (
  userId: string | undefined,
  idToken: string | undefined
): Promise<ICardData[] | undefined> => {
  try {
    const headers = {
      Authorization: idToken,
    };
    const response = await axios.get(
      API_BASE_URL + API_ENDPOINTS.CARDS + userId,
      { headers }
    );
    const cards: ICardData[] = response.data;
    return cards;
  } catch (error) {
    console.error(error);
  }
};

export const createOneCard = async (
  newCard: ICardData,
  idToken: string | undefined
): Promise<ICardData > => {
  try {
    const newCardReq = [newCard];
    const url = API_BASE_URL + API_ENDPOINTS.CARDS;
    const headers = {
      Authorization: idToken,
    };
    const response = await axios.post(url, newCardReq, {
      headers: headers,
    });
    const createdCard: ICardData = response.data.cards[0];
    return createdCard;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error
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

export const deleteCard = (
  id: string | undefined,
  idToken: string | undefined
): void => {
  const url = API_BASE_URL + API_ENDPOINTS.CARDS;
  const headers = {
    Authorization: idToken,
  };
  axios.delete(url + id, {
    headers: headers,
  });
};
