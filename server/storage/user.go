package storage

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoDBUserStorage struct {
	collection *mongo.Collection
}

func NewMongoDBUserStorage(collection *mongo.Collection) *MongoDBUserStorage {
	return &MongoDBUserStorage{
		collection: collection,
	}
}

func (ms *MongoDBUserStorage) GenerateID() string {
	return primitive.NewObjectID().Hex()
}

func (ms *MongoDBUserStorage) InsertUser(ctx context.Context, user *models.User) error {
	_, err := ms.collection.InsertOne(ctx, user)
	return err
}
