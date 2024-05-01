import axios from "axios";
import { ICardData, INote } from "../__types/types";
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
    console.error(err);
  }
};

export const getNoteContentWithNoteId = async (
  userId: string | undefined,
  idToken: string | undefined,
  currentNoteId: string | string[] | undefined
): Promise<string | undefined> => {
  if (currentNoteId === undefined) {
    return;
  }
  try {
    const headers = {
      Authorization: idToken,
    };
    const url = `${API_BASE_URL}${API_ENDPOINTS.NOTES}?userId=${userId}&noteId=${currentNoteId}`;
    const response = await axios.get(url, { headers });
    return response.data.body;
  } catch (err) {
    console.error(err);
  }
};

export const saveNote = async (
  editorContent: string,
  userId: string | undefined,
  idToken: string | undefined,
  noteId: string | undefined
): Promise<INote | undefined> => {
  try {
    const url = API_BASE_URL + API_ENDPOINTS.NOTES;
    const headers = {
      Authorization: idToken,
    };
    const reqBody: {
      htmlContent: string;
      userId: string | undefined;
      noteId?: string | undefined;
    } = { htmlContent: editorContent, userId: userId };
    if (noteId) {
      reqBody.noteId = noteId;
    }
    const response = await axios.post(url, reqBody, { headers: headers });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteNote = async (
  noteId: string | undefined,
  idToken: string | undefined
): Promise<void> => {
  try {
    const url = API_BASE_URL + API_ENDPOINTS.NOTES + noteId;
    const headers = {
      Authorization: idToken,
    };
    await axios.delete(url, { headers });
  } catch (err) {
    console.error(err);
  }
};
