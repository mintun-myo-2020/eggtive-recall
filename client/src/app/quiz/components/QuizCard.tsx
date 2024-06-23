import { IQuizDetails } from '@/__types/types'
import { Card } from 'flowbite-react'
import Link from 'next/link'
import React from 'react'

type QuizCardProps = {
    quizDetails: IQuizDetails
}

const QuizCard: React.FC<QuizCardProps> = ({ quizDetails }) => {
    return (
        <Card><Link href={"/quiz/" + quizDetails._id}>{quizDetails.title}</Link></Card>
    )
}

export default QuizCard