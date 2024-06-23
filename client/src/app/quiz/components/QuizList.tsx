import { IQuizDetails } from "@/__types/types";
import QuizCard from "./QuizCard";

type QuizListProps = {
    quizDetailsList: IQuizDetails[];
}

const QuizList = ({ quizDetailsList }: QuizListProps) => {
    return (
        <div>
            {quizDetailsList.map((quizDetail) => (
                <div key={quizDetail._id}><QuizCard quizDetails={quizDetail} /></div>
            ))}
        </div>
    )
}

export default QuizList