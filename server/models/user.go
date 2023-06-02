package models

type User struct {
	ID    string `bson:"_id,omitempty" json:"_id,omitempty"`
	Name  string `json:"name"`
	Email string `json:"email"`
}
