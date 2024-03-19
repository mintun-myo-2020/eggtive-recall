package controllers

import (
	"log"
	"net/http"

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

func (uc *NoteController) CreateNote(c *gin.Context) {

	var newNote models.Note

	log.Println(c.Request )

	if err := c.ShouldBindJSON(&newNote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := uc.noteService.CreateNote(&newNote)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newNote)

}

func (uc *NoteController) GetAllNotes(c *gin.Context) {
	notes, err := uc.noteService.GetAllNotes()

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notes)
}
