package services

import (
	"context"

	"github.com/myo-mintun-2020/eggtive-recall/models"
)

type NoteStorage interface {
	UpsertNote(ctx context.Context, note *models.Note) error
	GetAllNotes(ctx context.Context) ([]models.Note, error)
	GetNotesWithUserID(ctx context.Context, userId string) ([]models.Note, error)
	GetNoteWithUserIDAndNoteID(ctx context.Context, userId string, noteId string) (models.Note, error)
	DeleteNoteWithNoteID(ctx context.Context, noteId string) error
}

type NoteService struct {
	storage NoteStorage
}

func NewNoteService(storage NoteStorage) *NoteService {
	return &NoteService{
		storage: storage,
	}
}

func (ns *NoteService) UpsertNote(note *models.Note) error {

	err := ns.storage.UpsertNote(context.Background(), note)
	return err

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

func (ns NoteService) DeleteNoteWithNoteID(noteId string) error {
	err := ns.storage.DeleteNoteWithNoteID(context.Background(), noteId)
	return err
}
