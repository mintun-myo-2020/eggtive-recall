package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/services"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetCardsWithUserId(c *gin.Context) {
	card, err := services.GetCardsWithUserId(c.Param("userId"))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, card)
}

func GetAllCards(c *gin.Context) {
	cards, err := services.GetAllCards()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cards)
}

func UpsertCard(c *gin.Context) {
	var cards []models.Card

	if err := c.ShouldBindJSON(&cards); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	numCards := len(cards)

	for i := range cards {
		err := services.UpsertCard(&cards[i])

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	message := fmt.Sprintf("Successfully created %d cards", numCards)

	c.JSON(http.StatusOK, gin.H{"message": message, "cards": cards})
}

func UpdateCard(c *gin.Context) {

	var newCard *models.Card

	if err := c.ShouldBindJSON(&newCard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	err := services.UpdateCard(c.Param("id"), newCard)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	objID, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	newCard.ID = objID
	c.JSON(http.StatusOK, newCard)
}

func DeleteCard(c *gin.Context) {

	err := services.DeleteCard(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	message := "Successfully deleted card with id " + c.Param("id")

	c.JSON(http.StatusOK, gin.H{"message": message})

}
