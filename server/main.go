package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/myo-mintun-2020/eggtive-recall/router"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

func main() {

	environment := os.Getenv("ENVIRONMENT")

	if environment != "production" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}
	DB_PASSWORD := os.Getenv("MONGODB_PASSWORD")
	DB_NAME := os.Getenv("MONGODB_NAME")
	mongoURI := fmt.Sprintf("mongodb+srv://mintunxdd:%s@active-recall.qrbyadj.mongodb.net/?retryWrites=true&w=majority", DB_PASSWORD)

	db, err := storage.Connect(mongoURI, DB_NAME)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		fmt.Println("disconnected from mongo")
		if err := db.Client().Disconnect(context.TODO()); err != nil {
			log.Fatalf("Failed to disconnect from MongoDB: %v", err)
		}
	}()

	r := router.SetupRouter()
	r.Run("0.0.0.0:8080")

}
