package models

type Note struct {
	ID    string `bson:"_id" json:"id,omitempty"`
	Title string `json:"title"`
	Body  string `json:"body"`
}
