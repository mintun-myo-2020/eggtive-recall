package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/controllers"
	"github.com/myo-mintun-2020/eggtive-recall/middleware"
	"github.com/myo-mintun-2020/eggtive-recall/services"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CorsMiddleware())

	// Public routes (no auth required)
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Protected routes (auth + authorization required)
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	mongoCardsDBCollection := storage.GetCollection("cards")
	cardStorage := storage.NewMongoDBCardStorage(mongoCardsDBCollection)
	cardService := services.NewCardService(cardStorage)
	cardController := controllers.NewCardController(*cardService)
	cardGroup := protected.Group("/card")
	{
		cardGroup.GET("/:userId", cardController.GetCardsWithUserId)
		cardGroup.GET("/", cardController.GetAllCards)
		cardGroup.POST("/", cardController.UpsertCard)
		cardGroup.DELETE("/:id", cardController.DeleteCard)
	}

	mongoUserDBCollection := storage.GetCollection("user")
	userStorage := storage.NewMongoDBUserStorage(mongoUserDBCollection)
	userService := services.NewUserService(userStorage)
	userController := controllers.NewUserController(userService)
	userGroup := protected.Group("/user")
	{
		userGroup.POST("/", userController.CreateUser)
	}

	mongoNotesDBCollection := storage.GetCollection("notes")
	noteStorage := storage.NewMongoDBNoteStorage(mongoNotesDBCollection)
	noteService := services.NewNoteService(noteStorage)
	noteController := controllers.NewNoteController(noteService)
	noteGroup := protected.Group("/note")
	{
		noteGroup.POST("/", noteController.UpsertNote)
		noteGroup.GET("/:userId", noteController.GetNotesWithUserID)
		noteGroup.GET("/", noteController.GetNoteWithUserIDAndNoteID)
		noteGroup.DELETE("/:noteId", noteController.DeleteNoteWithNoteID)
	}

	return r
}
