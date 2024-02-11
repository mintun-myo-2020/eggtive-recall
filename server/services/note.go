package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
	"github.com/myo-mintun-2020/eggtive-recall/storage"
)

type NoteService struct {
	storage storage.NoteStorage
}

func NewNoteService(storage storage.NoteStorage) *NoteService {
	return &NoteService{
		storage: storage,
	}
}

func (ns *NoteService) CreateNote(note *models.Note) error {


	err := ns.storage.InsertNote(context.Background(), note)
	if err == nil {
		return err
	}
	return nil

}

func (ns *NoteService) GetAllNotes() ([]*models.Note, error) {
	return ns.storage.GetAllNotes(context.Background())
}
