package services

import (
	"context"
	"errors"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CardService struct {
}

func NewCardService() *CardService {
	return &CardService{}
}

func (cs *CardService) UpsertCard(card *models.Card) error {
	collection := storage.GetCollection("cards")
	if collection == nil {
		return errors.New("failed to get the cards collection")
	}

	if card.ID.Hex() == "000000000000000000000000" {
		card.ID = primitive.NewObjectID()
	}

	filter := bson.M{"_id": card.ID}
	update := bson.M{"$set": card}
	options := options.Update().SetUpsert(true)

	_, err := collection.UpdateOne(context.Background(), filter, update, options)
	if err != nil {
		return err
	}
	return nil
}

func (cs *CardService) GetCardsWithUserId(userId string) ([]models.Card, error) {

	filter := bson.M{"userId": userId}
	var cards []models.Card

	collection := storage.GetCollection("cards")
	if collection == nil {
		return nil, errors.New("failed to get the cards collection")
	}
	// Execute the find operation and retrieve the result.
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var card models.Card
		if err := cursor.Decode(&card); err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

func (cs *CardService) GetAllCards() ([]models.Card, error) {
	var cards []models.Card

	collection := storage.GetCollection("cards")
	if collection == nil {
		return nil, errors.New("failed to get the cards collection")
	}

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	// iterate through the cursor and decode each document into a card
	for cursor.Next(context.Background()) {
		var card models.Card
		if err := cursor.Decode(&card); err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

func (cs *CardService) UpdateCard(id string, updatedCard *models.Card) error {
	collection := storage.GetCollection("cards")
	if collection == nil {
		return errors.New("failed to get the cards collection")
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.D{{Key: "_id", Value: objID}}
	update := bson.M{"$set": bson.M{
		"question": updatedCard.Question,
		"answer":   updatedCard.Answer,
		"position": updatedCard.Position,
	}}
	result, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}
	if result.ModifiedCount == 0 {
		message := "Card with id " + id + " not found"
		return errors.New(message)
	}

	return nil
}

func (cs *CardService) DeleteCard(id string) error {
	collection := storage.GetCollection("cards")
	if collection == nil {
		return errors.New("failed to get the cards collection")
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		message := "Card with id " + id + " not found"
		return errors.New(message)
	}

	return nil
}
