package controllers

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/services"
)

type NoteController struct {
	noteService *services.NoteService
}

func NewNoteController(noteService *services.NoteService) *NoteController {
	return &NoteController{
		noteService: noteService,
	}
}

func (nc *NoteController) CreateNote(c *gin.Context) {

	var jsonInput struct {
		HtmlContent string `json:"htmlContent"`
		UserID      string `json:"userID"`
	}

	if err := c.ShouldBindJSON(&jsonInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	contentRegex := regexp.MustCompile(`<.*?>(.*?)</.*?>`)
	contentMatches := contentRegex.FindStringSubmatch(jsonInput.HtmlContent)
	title := contentMatches[1] // Content inside the first tag

	newNote := models.Note{
		Title:  title,
		Body:   jsonInput.HtmlContent,
		UserID: jsonInput.UserID,
	}

	err := nc.noteService.CreateNote(&newNote)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newNote)

}

func (nc *NoteController) GetAllNotes(c *gin.Context) {
	userID := c.Param("userId")

	notes, err := nc.noteService.GetNotesWithUserID(userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notes)
}
