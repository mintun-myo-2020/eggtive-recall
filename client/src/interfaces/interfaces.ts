export interface IPositionData {
  x: number;
  y: number;
}

export interface IQuestion {
  question: string;
}

export interface IAnswer {
  answer: string;
}

export interface ICardData  {
  _id?: string;
  userId: string | undefined ;
  question: IQuestion;
  answer: IAnswer;
  position: IPositionData;
};

export interface IGoUser {
  _id: string;
  name: string;
  email: string;
  cards: ICardData[];
}

export interface IDeck {
  _id?: string;
  name: string;
  cards: ICardData[];
}