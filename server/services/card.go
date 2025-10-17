package services

import (
	"context"
	"log"

	"github.com/myo-mintun-2020/eggtive-recall/models"
)

type CardStorage interface {
	UpsertCard(ctx context.Context, card *models.Card) error
	GetAllCards(ctx context.Context) ([]models.Card, error)
	GetCardsWithUserId(ctx context.Context, userId string) ([]models.Card, error)
	DeleteCard(ctx context.Context, id string) error
}

type CardService struct {
	storage CardStorage
}

func NewCardService(storage CardStorage) *CardService {
	return &CardService{
		storage: storage,
	}
}

func (cs *CardService) UpsertCard(card *models.Card) error {
	err := cs.storage.UpsertCard(context.Background(), card)
	return err
}

func (cs *CardService) GetCardsWithUserId(userId string) ([]models.Card, error) {

	cards, err := cs.storage.GetCardsWithUserId(context.Background(), userId)
	if err != nil {
		return nil, err
	}
	return cards, nil
}

func (cs *CardService) GetAllCards() ([]models.Card, error) {

	cards, err := cs.storage.GetAllCards(context.Background())
	if err != nil {
		return nil, err
	}

	return cards, nil

}

func (cs *CardService) DeleteCard(id string) error {
	err := cs.storage.DeleteCard(context.Background(), id)
	log.Println(err)

	return err

}
