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

func (ns *NoteService) UpsertNote(note *models.Note) error {

	err := ns.storage.UpsertNote(context.Background(), note)
	if err == nil {
		return err
	}
	return nil

}

func (ns *NoteService) GetNotesWithUserID(userId string) ([]models.Note, error) {

	notes, err := ns.storage.GetNotesWithUserID(context.Background(), userId)
	if err != nil {
		return nil, err
	}
	return notes, nil
}

func (ns *NoteService) GetNoteWithUserIDAndNoteID(userId string, noteId string) (models.Note, error) {

	note, err := ns.storage.GetNoteWithUserIDAndNoteID(context.Background(), userId, noteId)
	if err != nil {
		return models.Note{}, err
	}
	return note, nil
}
