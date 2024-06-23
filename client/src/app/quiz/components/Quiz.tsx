import React from 'react'

const fetchQuiz = async (quizId: string) => {
    const res = await fetch(`http://localhost:4000/api/quiz/${quizId}`)
    const data = await res.json()
    return data
}

type QuizProps = {
    quizId: string

}

const Quiz = ({ quizId }: QuizProps) => {
    return (
        <div>{quizId}</div>
    )
}

export default Quiz