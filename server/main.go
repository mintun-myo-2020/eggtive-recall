package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
	"github.com/myo-mintun-2020/eggtive-recall/controllers"
	"github.com/myo-mintun-2020/eggtive-recall/router"
	"github.com/myo-mintun-2020/eggtive-recall/services"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

func main() {
	environment := os.Getenv("ENVIRONMENT")
	if environment != "production" {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// Create context with graceful shutdown support
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	mongodb, err := storage.InitializeDatabase(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func() {
		if err := mongodb.Close(context.Background()); err != nil {
			log.Printf("Error closing database: %v", err)
		}
	}()

	factory := storage.NewStorageFactory(mongodb)

	cardController := initializeCardController(ctx, factory)
	userController := initializeUserController(ctx, factory)
	noteController := initializeNoteController(ctx, factory)

	r := router.SetupRouter(cardController, userController, noteController)

	// Start server with graceful shutdown
	srv := &http.Server{
		Addr:    "0.0.0.0:8080",
		Handler: r,
	}

	// Start server in goroutine
	go func() {
		log.Println("Server starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	<-ctx.Done()
	log.Println("Shutting down server...")

	// Graceful shutdown with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited gracefully")
}

func initializeCardController(ctx context.Context, factory *storage.StorageFactory) *controllers.CardController {
	cardStorage := factory.CreateCardStorage(ctx)
	cardService := services.NewCardService(cardStorage)
	return controllers.NewCardController(cardService)
}

func initializeUserController(ctx context.Context, factory *storage.StorageFactory) *controllers.UserController {
	userStorage := factory.CreateUserStorage(ctx)
	userService := services.NewUserService(userStorage)
	return controllers.NewUserController(userService)
}

func initializeNoteController(ctx context.Context, factory *storage.StorageFactory) *controllers.NoteController {
	noteStorage := factory.CreateNoteStorage(ctx)
	noteService := services.NewNoteService(noteStorage)
	return controllers.NewNoteController(noteService)
}
