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
	r.Use(middleware.AuthMiddleware())

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	mongoCardsDBCollection := storage.GetCollection("cards")
	cardStorage := storage.NewMongoDBCardStorage(mongoCardsDBCollection)
	cardService := services.NewCardService(cardStorage)
	cardController := controllers.NewCardController(*cardService)
	cardGroup := r.Group("/card")
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
	userGroup := r.Group("/user")
	{
		userGroup.POST("/", userController.CreateUser)
	}

	mongoNotesDBCollection := storage.GetCollection("notes")
	noteStorage := storage.NewMongoDBNoteStorage(mongoNotesDBCollection)
	noteService := services.NewNoteService(noteStorage)
	noteController := controllers.NewNoteController(noteService)
	noteGroup := r.Group("/note")
	{
		noteGroup.POST("/", noteController.CreateNote)
		noteGroup.GET("/", noteController.GetAllNotes)
	}

	return r
}
