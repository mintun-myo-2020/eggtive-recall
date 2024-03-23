import axios from "axios";
import { ICardData, INote } from "../types/types";
import { API_BASE_URL, API_ENDPOINTS } from "./endpoints";

export const getNotes = async (
  userId: string | undefined,
  idToken: string | undefined
): Promise<INote[] | undefined> => {
  try {
    const headers = {
      Authorization: idToken,
    };
    const response = await axios.get(
      API_BASE_URL + API_ENDPOINTS.NOTES + userId,
      { headers }
    );
    const notes: INote[] = response.data;
    return notes;
  } catch (err) {
    console.log(err);
  }
};

export const saveNote = async (
  editorContent: string,
  userId: string | undefined,
  idToken: string | undefined
): Promise<INote | undefined> => {
  try {
    const url = API_BASE_URL + API_ENDPOINTS.NOTES;
    const headers = {
      Authorization: idToken,
    };
    const reqBody = { htmlContent: editorContent, userId: userId };
    const response = await axios.post(url, reqBody, { headers: headers });
    return response.data.note;
  } catch (err) {
    console.log(err);
  }
};
