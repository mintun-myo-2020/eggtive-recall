
import { IQuizDetails } from '@/__types/types';
import QuizCard from '../components/QuizCard'
import QuizList from '../components/QuizList'
import Quiz from '../components/Quiz';

const fetchAllQuizzes = async () => {
  const tempRes: IQuizDetails[] = [
    { _id: "1", title: "Quiz 1" },
    { _id: "2", title: "Quiz 2" },
    { _id: "3", title: "Quiz 3" },
    { _id: "4", title: "Quiz 4" },
    { _id: "5", title: "Quiz 5" },
  ];
  return tempRes;
}



const Page = async ({ params }: { params: { quizId: string } }) => {


  if (params.quizId != undefined) {
    return (
      < div >
        <Quiz quizId={params.quizId} />
      </div >
    )
  }

  const quizzes = await fetchAllQuizzes();

  return (
    <div>
      <QuizList quizDetailsList={quizzes} />
    </div>
  )
}

export default Page