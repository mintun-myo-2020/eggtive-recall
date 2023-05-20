package models

type Question struct {
	Question string `json:"question"`
}

func (q *Question) GetQuestion() string {
	return q.Question
}
