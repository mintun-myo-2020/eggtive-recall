package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/services"
)

type CardController struct {
	cardService services.CardService
}

func NewCardController(cardService services.CardService) *CardController {
	return &CardController{
		cardService: cardService,
	}
}

func (cc *CardController) GetCardsWithUserId(c *gin.Context) {
	userID := c.Param("userId")

	card, err := cc.cardService.GetCardsWithUserId(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, card)
}

func (cc *CardController) GetAllCards(c *gin.Context) {
	cards, err := cc.cardService.GetAllCards()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cards)
}

func (cc *CardController) UpsertCard(c *gin.Context) {
	var cards []models.Card

	if err := c.ShouldBindJSON(&cards); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	numCards := len(cards)

	for i := range cards {
		err := cc.cardService.UpsertCard(&cards[i])

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	message := fmt.Sprintf("Successfully created %d cards", numCards)

	c.JSON(http.StatusOK, gin.H{"message": message, "cards": cards})
}

func (cc *CardController) DeleteCard(c *gin.Context) {
	err := cc.cardService.DeleteCard(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "err.Error()"})
		return
	}

	message := "Successfully deleted card with id " + c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": message})
}
