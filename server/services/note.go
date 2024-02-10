package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateNote(note *models.Note) error {

	collection := storage.GetCollection("notes")

	if note.ID.Hex() == "000000000000000000000000" {
		note.ID = primitive.NewObjectID()
	}

	_, err := collection.InsertOne(context.Background(), note)
	if err == nil {
		return err
	}
	return nil

}
