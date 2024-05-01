export interface Option {
  a: string;
  b: string;
  c: string;
  d: string;
}

export interface Question {
  question: string;
  options: Option;
  correctOption: string;
}

export interface QuizSchema {
  quiz: {
    questions: Question[];
  };
}
