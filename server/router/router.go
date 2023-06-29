package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/active-recall-BE/controllers"
	"github.com/myo-mintun-2020/active-recall-BE/middleware"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CorsMiddleware())
	r.Use(middleware.AuthMiddleware())

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	cardGroup := r.Group("/card")
	{
		cardGroup.GET("/:userId", controllers.GetCardsWithUserId)
		cardGroup.GET("/", controllers.GetAllCards)
		cardGroup.POST("/", controllers.UpsertCard)
		cardGroup.PUT("/:id", controllers.UpdateCard)
		cardGroup.DELETE("/:id", controllers.DeleteCard)
	}

	userGroup := r.Group("/user")
	{
		userGroup.POST("/", controllers.CreateUser)
	}

	return r
}
