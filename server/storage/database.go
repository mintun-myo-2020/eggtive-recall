package storage

import "context"

type Database interface {
	InsertOne(ctx context.Context, document interface{}) error
	// Add other database operations as needed
}

type DatabaseFactory interface {
	GetDatabase() Database
}
