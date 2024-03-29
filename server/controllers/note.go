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

func (nc *NoteController) UpsertNote(c *gin.Context) {

	var jsonInput struct {
		HtmlContent string `json:"htmlContent"`
		UserId      string `json:"userId"`
		NoteId      string `json:"noteId,omitempty"`
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
		UserId: jsonInput.UserId,
		NoteId: jsonInput.NoteId,
	}

	err := nc.noteService.UpsertNote(&newNote)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newNote)

}

func (nc *NoteController) GetNotesWithUserID(c *gin.Context) {
	userId := c.Param("userId")

	notes, err := nc.noteService.GetNotesWithUserID(userId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notes)
}

func (nc *NoteController) GetNoteWithUserIDAndNoteID(c *gin.Context) {
	userId := c.Query("userId")
	noteId := c.Query("noteId")

	println(userId, noteId)
	note, err := nc.noteService.GetNoteWithUserIDAndNoteID(userId, noteId)
	println(note.Body)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, note)
}

func (nc *NoteController) DeleteNoteWithNoteID(c *gin.Context) {
	noteId := c.Param("noteId")

	err := nc.noteService.DeleteNoteWithNoteID(noteId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted note with id " + noteId})
}