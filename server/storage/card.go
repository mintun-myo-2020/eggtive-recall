package storage

import (
	"context"
	"errors"
	"log"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoDBCardStorage struct {
	collection *mongo.Collection
}

func NewMongoDBCardStorage(collection *mongo.Collection) *MongoDBCardStorage {
	return &MongoDBCardStorage{
		collection: collection,
	}
}

func (ms *MongoDBCardStorage) generateID() string {
	return primitive.NewObjectID().Hex()
}

func (ms *MongoDBCardStorage) UpsertCard(ctx context.Context, card *models.Card) error {

	if ms.collection == nil {
		return errors.New("failed to get the cards collection")
	}

	if card.ID == "" {
		card.ID = ms.generateID()
	}

	filter := bson.M{"_id": card.ID}
	update := bson.M{"$set": card}
	options := options.Update().SetUpsert(true)

	_, err := ms.collection.UpdateOne(ctx, filter, update, options)
	if err != nil {
		return err
	}
	return nil
}

func (ms *MongoDBCardStorage) GetAllCards(ctx context.Context) ([]models.Card, error) {
	var cards []models.Card

	if ms.collection == nil {
		return nil, errors.New("failed to get the cards collection")
	}

	cursor, err := ms.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
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

func (ms *MongoDBCardStorage) GetCardsWithUserId(ctx context.Context, userId string) ([]models.Card, error) {
	filter := bson.M{"userId": userId}
	var cards []models.Card
	if ms.collection == nil {
		return nil, errors.New("failed to get the cards collection")
	}
	cursor, err := ms.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var card models.Card
		if err := cursor.Decode(&card); err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return cards, err
}

func (ms *MongoDBCardStorage) DeleteCard(ctx context.Context, id string) error {

	if ms.collection == nil {
		return errors.New("failed to get the cards collection")
	}

	result, err := ms.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		log.Println("line 130")
		return err
	}

	if result.DeletedCount == 0 {
		message := "Card with id " + id + " not found"
		return errors.New(message)
	}

	return nil
}
