package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

func CreateNote(note *models.Note) error {

	collection := storage.GetCollection("notes")

	_, err := collection.InsertOne(context.Background(), note)
	if err == nil {
		return err
	}
	return nil

}
