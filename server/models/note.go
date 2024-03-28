package models

type Note struct {
	NoteId string `bson:"_id" json:"id,omitempty"`
	UserId string `bson:"userId" json:"userId,omitempty"`
	Title  string `json:"title"`
	Body   string `json:"body"`
}
