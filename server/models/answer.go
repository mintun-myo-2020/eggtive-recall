package models

type Answer struct {
	Answer string `json:"answer"`
}

func (a *Answer) GetAnswer() string {
	return a.Answer
}
