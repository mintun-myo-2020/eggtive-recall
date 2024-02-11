package storage

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NoteStorage interface {
	GenerateID() string
	InsertNote(ctx context.Context, note *models.Note) error
	GetAllNotes(ctx context.Context) ([]*models.Note, error)
}

type MongoDBNoteStorage struct {
	collection *mongo.Collection
}

func NewMongoDBNoteStorage(collection *mongo.Collection) *MongoDBNoteStorage {
	return &MongoDBNoteStorage{
		collection: collection,
	}
}

func (ms *MongoDBNoteStorage) GenerateID() string {
	return primitive.NewObjectID().Hex()
}

func (ms *MongoDBNoteStorage) InsertNote(ctx context.Context, note *models.Note) error {
	_, err := ms.collection.InsertOne(ctx, note)
	return err
}

func (ms *MongoDBNoteStorage) GetAllNotes(ctx context.Context) ([]*models.Note, error) {
	cursor, err := ms.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var notes []*models.Note
	for cursor.Next(ctx) {
		var note models.Note
		if err := cursor.Decode(&note); err != nil {
			return nil, err
		}
		notes = append(notes, &note)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return notes, nil
}
