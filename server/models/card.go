package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Position struct {
	X int32 `json:"x"`
	Y int32 `json:"y"`
}

type Card struct {
	ID       primitive.ObjectID `bson:"_id" json:"_id,omitempty"`
	UserID   string             `bson:"userId" json:"userId,omitempty"`
	Question *Question          `json:"question"`
	Answer   *Answer            `json:"answer"`
	Position *Position          `json:"position"`
}
