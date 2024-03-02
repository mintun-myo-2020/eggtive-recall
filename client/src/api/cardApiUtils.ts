import axios from "axios";
import { ICardData, INote } from "../types/types";
import { API_BASE_URL, API_ENDPOINTS } from "./endpoints";

export const getNotes = async (): Promise<INote[] | undefined> => {
  try {
    const response = await axios.get(API_BASE_URL + API_ENDPOINTS.NOTES);
    const notes: INote[] = response.data;
    return notes;
  } catch (err) {
    console.log(err);
  }
};
