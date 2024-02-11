package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

type UserService struct {
	storage storage.UserStorage
}

func NewUserService(storage storage.UserStorage) *UserService {
	return &UserService{
		storage: storage,
	}
}

func (us UserService) CreateUser(user *models.User) error {

	err := us.storage.InsertUser(context.Background(), user)
	if err != nil {
		return err
	}

	return nil
}
