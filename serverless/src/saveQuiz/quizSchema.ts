export interface Question {
    question: string;
    answer: string;
}

export interface QuizSchema {
    quiz: Question[];
    userId: string | undefined;
}