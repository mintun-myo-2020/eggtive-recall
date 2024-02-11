package services

import (
	"context"
	"errors"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

type UserService struct {

}

func NewUserService() *UserService {
	return &UserService{}
}


func (us UserService) CreateUser(user *models.User) error {
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
