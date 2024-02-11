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

	cardService := services.NewCardService()
	cardController := controllers.NewCardController(*cardService)
	cardGroup := r.Group("/card")
	{
		cardGroup.GET("/:userId", cardController.GetCardsWithUserId)
		cardGroup.GET("/", cardController.GetAllCards)
		cardGroup.POST("/", cardController.UpsertCard)
		cardGroup.PUT("/:id", cardController.UpdateCard)
		cardGroup.DELETE("/:id", cardController.DeleteCard)
	}

	userService := services.NewUserService()
	userController := controllers.NewUserController(*userService)
	userGroup := r.Group("/user")
	{
		userGroup.POST("/", userController.CreateUser)
	}

	mongoDBCollection := storage.GetCollection("notes")
	noteStorage := storage.NewMongoDBNoteStorage(mongoDBCollection)
	noteService := services.NewNoteService(noteStorage)
	noteController := controllers.NewNoteController(noteService)
	noteGroup := r.Group("/note")
	{
		noteGroup.POST("/", noteController.CreateNote)
		noteGroup.GET("/", noteController.GetAllNotes)
	}

	return r
}
