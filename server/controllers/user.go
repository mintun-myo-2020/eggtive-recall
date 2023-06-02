package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/active-recall-BE/models"
	"github.com/myo-mintun-2020/active-recall-BE/services"
)

func CreateUser(c *gin.Context) {

	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := services.CreateUser(&newUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newUser)
}
