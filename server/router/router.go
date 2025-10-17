package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/middleware"
)

type CardController interface {
	GetCardsWithUserId(c *gin.Context)
	GetAllCards(c *gin.Context)
	UpsertCard(c *gin.Context)
	DeleteCard(c *gin.Context)
}

type UserController interface {
	CreateUser(c *gin.Context)
}

type NoteController interface {
	UpsertNote(c *gin.Context)
	GetNotesWithUserID(c *gin.Context)
	GetNoteWithUserIDAndNoteID(c *gin.Context)
	DeleteNoteWithNoteID(c *gin.Context)
}

func SetupRouter(
	cardController CardController,
	userController UserController,
	noteController NoteController,
) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CorsMiddleware())

	// Public routes
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware())

	setupCardRoutes(protected, cardController)
	setupUserRoutes(protected, userController)
	setupNoteRoutes(protected, noteController)

	return r
}

func setupCardRoutes(protected *gin.RouterGroup, cardController CardController) {
	cardGroup := protected.Group("/card")
	{
		cardGroup.GET("/:userId", cardController.GetCardsWithUserId)
		cardGroup.GET("/", cardController.GetAllCards)
		cardGroup.POST("/", cardController.UpsertCard)
		cardGroup.DELETE("/:id", cardController.DeleteCard)
	}
}

func setupUserRoutes(protected *gin.RouterGroup, userController UserController) {
	userGroup := protected.Group("/user")
	{
		userGroup.POST("/", userController.CreateUser)
	}
}

func setupNoteRoutes(protected *gin.RouterGroup, noteController NoteController) {
	noteGroup := protected.Group("/note")
	{
		noteGroup.POST("/", noteController.UpsertNote)
		noteGroup.GET("/:userId", noteController.GetNotesWithUserID)
		noteGroup.GET("/", noteController.GetNoteWithUserIDAndNoteID)
		noteGroup.DELETE("/:noteId", noteController.DeleteNoteWithNoteID)
	}
}
