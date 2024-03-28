package storage

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var db *mongo.Database

func Connect(uri string, database string) (*mongo.Database, error) {

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		return nil, fmt.Errorf("error pinging MongoDB: %s", err)
	}

	db = client.Database(database)

	return db, nil
}

func GetCollection(collectionName string) *mongo.Collection {
	if db == nil {
		log.Fatal("MongoDB client not initialized")
		return nil
	}
	return db.Collection(collectionName)
}
