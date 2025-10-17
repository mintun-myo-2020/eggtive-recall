package storage

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoDB wraps a MongoDB database connection
type MongoDB struct {
	client *mongo.Client
	db     *mongo.Database
}

// NewMongoDB creates a new MongoDB connection with dependency injection
func NewMongoDB(ctx context.Context, uri, database string) (*MongoDB, error) {
	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to connect: %w", err)
	}

	// Verify connection
	if err := client.Ping(ctx, nil); err != nil {
		client.Disconnect(ctx) // Clean up on error
		return nil, fmt.Errorf("failed to ping: %w", err)
	}

	return &MongoDB{
		client: client,
		db:     client.Database(database),
	}, nil
}

// GetCollection returns a MongoDB collection
func (m *MongoDB) GetCollection(name string) *mongo.Collection {
	return m.db.Collection(name)
}

// Close closes the MongoDB connection
func (m *MongoDB) Close(ctx context.Context) error {
	if m.client != nil {
		return m.client.Disconnect(ctx)
	}
	return nil
}

// Health checks if the connection is still alive
func (m *MongoDB) Health(ctx context.Context) error {
	return m.client.Ping(ctx, nil)
}
