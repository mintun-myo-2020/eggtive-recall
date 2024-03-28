package storage

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NoteStorage interface {
	generateID() string
	InsertNote(ctx context.Context, note *models.Note) error
	GetAllNotes(ctx context.Context) ([]models.Note, error)
	GetNotesWithUserID(ctx context.Context, userId string) ([]models.Note, error)
	GetNoteWithUserIDAndNoteID(ctx context.Context, userId string, noteId string) (models.Note, error)
}

type MongoDBNoteStorage struct {
	collection *mongo.Collection
}

func NewMongoDBNoteStorage(collection *mongo.Collection) *MongoDBNoteStorage {
	return &MongoDBNoteStorage{
		collection: collection,
	}
}

func (ms *MongoDBNoteStorage) generateID() string {
	return primitive.NewObjectID().Hex()
}

func (ms *MongoDBNoteStorage) InsertNote(ctx context.Context, note *models.Note) error {
	if note.NoteId == "" {
		note.NoteId = ms.generateID()
	}

	_, err := ms.collection.InsertOne(ctx, note)
	return err
}

func (ms *MongoDBNoteStorage) GetNotesWithUserID(ctx context.Context, userId string) ([]models.Note, error) {
	filter := bson.M{"userId": userId}

	var notes []models.Note

	cursor, err := ms.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var note models.Note
		if err := cursor.Decode(&note); err != nil {
			return nil, err
		}
		notes = append(notes, note)

	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return notes, nil
}

func (ms *MongoDBNoteStorage) GetNoteWithUserIDAndNoteID(ctx context.Context, userId string, noteId string) (models.Note, error) {
	filter := bson.M{"_id": noteId}

	var note models.Note
	err := ms.collection.FindOne(ctx, filter).Decode(&note)
	if err != nil {
		return models.Note{}, err
	}
	return note, nil

}

func (ms *MongoDBNoteStorage) GetAllNotes(ctx context.Context) ([]models.Note, error) {
	var notes []models.Note

	cursor, err := ms.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var note models.Note
		if err := cursor.Decode(&note); err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return notes, nil
}
