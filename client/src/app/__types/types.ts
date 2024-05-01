export type IPositionData = {
  x: number;
  y: number;
}

export type IQuestion = {
  question: string;
}

export type IAnswer = {
  answer: string;
}

export type ICardData  = {
  _id?: string;
  userId: string | undefined ;
  question: IQuestion;
  answer: IAnswer;
  position: IPositionData;
};

export type IGoUser = {
  _id: string;
  name: string;
  email: string;
  cards: ICardData[];
}

export type IDeck = {
  _id?: string;
  name: string;
  cards: ICardData[];
}

export type INote = {
  id?: string;
  title: string;
  content: string
}