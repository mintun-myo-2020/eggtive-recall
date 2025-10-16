package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
)

type UserStorage interface {
	InsertUser(ctx context.Context, user *models.User) error
}

type UserService struct {
	storage UserStorage
}

func NewUserService(storage UserStorage) *UserService {
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
