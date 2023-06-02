package services

import (
	"context"
	"errors"

	"github.com/myo-mintun-2020/active-recall-BE/models"
	"github.com/myo-mintun-2020/active-recall-BE/storage"
)

func CreateUser(user *models.User) error {
	collection := storage.GetCollection("users")
	if collection == nil {
		return errors.New("failed to get the users collection")
	}

	_, err := collection.InsertOne(context.Background(), user)
	if err != nil {
		return err
	}

	return nil
}
