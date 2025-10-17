package storage

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/myo-mintun-2020/eggtive-recall/services"
)

// StorageFactory creates storage implementations with dependency injection
type StorageFactory struct {
	mongodb *MongoDB
	// Add other databases here when needed
	// dynamodb *DynamoDB
}

// NewStorageFactory creates a factory with injected database connection
func NewStorageFactory(mongodb *MongoDB) *StorageFactory {
	return &StorageFactory{
		mongodb: mongodb,
	}
}

// CreateCardStorage creates a card storage implementation
func (f *StorageFactory) CreateCardStorage(ctx context.Context) services.CardStorage {
	if f.mongodb != nil {
		collection := f.mongodb.GetCollection("cards")
		return NewMongoDBCardStorage(collection)
	}

	log.Fatal("No database configured")
	return nil
}

// CreateNoteStorage creates a note storage implementation
func (f *StorageFactory) CreateNoteStorage(ctx context.Context) services.NoteStorage {
	if f.mongodb != nil {
		collection := f.mongodb.GetCollection("notes")
		return NewMongoDBNoteStorage(collection)
	}

	log.Fatal("No database configured")
	return nil
}

// CreateUserStorage creates a user storage implementation
func (f *StorageFactory) CreateUserStorage(ctx context.Context) services.UserStorage {
	if f.mongodb != nil {
		collection := f.mongodb.GetCollection("user")
		return NewMongoDBUserStorage(collection)
	}

	log.Fatal("No database configured")
	return nil
}

// InitializeDatabase creates the appropriate database connection based on config
func InitializeDatabase(ctx context.Context) (*MongoDB, error) {
	storageType := os.Getenv("STORAGE_TYPE")
	if storageType == "" {
		storageType = "mongodb"
	}

	switch storageType {
	case "mongodb":
		dbPassword := os.Getenv("MONGODB_PASSWORD")
		dbName := os.Getenv("MONGODB_NAME")
		mongoURI := fmt.Sprintf(
			"mongodb+srv://mintunxdd:%s@active-recall.qrbyadj.mongodb.net/?retryWrites=true&w=majority",
			dbPassword,
		)

		mongodb, err := NewMongoDB(ctx, mongoURI, dbName)
		if err != nil {
			return nil, fmt.Errorf("failed to initialize MongoDB: %w", err)
		}

		log.Println("Successfully connected to MongoDB")
		return mongodb, nil

	case "dynamodb":
		// TODO: Implement DynamoDB
		return nil, fmt.Errorf("DynamoDB not yet implemented")

	default:
		return nil, fmt.Errorf("unknown storage type: %s", storageType)
	}
}
