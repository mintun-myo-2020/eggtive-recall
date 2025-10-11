import TextEditor from "../../components/notebook/textEditor/TextEditor";

import { useEffect, useState, useRef } from "react";

import { getNoteContentWithNoteId, getNotes } from "../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

import NotebookSidebar from "../../components/notebook/sidebar/NotebookSidebar";
import { useNavigate, useParams } from "react-router-dom";

const Notebook = () => {
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const { currentNoteId } = useParams<{ currentNoteId: string | undefined }>();
  const [currentNoteContent, setCurrentNoteContent] = useState<
    string | undefined
  >();

  const [noteTitles, setNoteTitles] = useState<
    { id: string | undefined; title: string }[]
  >([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    const getNote = async () => {
      try {
        const idToken = await user?.getIdToken();
        const userId = await user?.uid;
        const fetchedNote = await getNoteContentWithNoteId(
          userId,
          idToken,
          currentNoteId
        );
        setCurrentNoteContent(fetchedNote);
      } catch (err) {
        console.error(err);
      }
    };

    getNote();
  }, [user, currentNoteId]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const getNoteTitles = async () => {
      try {
        const idToken = await user?.getIdToken();
        const userId = await user?.uid;
        const fetchedNotes = await getNotes(userId, idToken);
        const titles = fetchedNotes?.map((note) => ({
          id: note.id,
          title: note.title,
        }));
        if (titles === undefined) {
          setNoteTitles([]);
          setIsPageLoading(false);
        } else {
          setNoteTitles(titles);
          setIsPageLoading(false);
        }
      } catch (err) {
        console.error(err);
        setIsPageLoading(false);
      }
    };

    getNoteTitles();
  }, [loading, user]);

  const currentNoteIdRef = useRef(currentNoteId);

  // Update ref when currentNoteId changes
  useEffect(() => {
    currentNoteIdRef.current = currentNoteId;
  }, [currentNoteId]);

  const updateNoteTitle = (updatedNote: {
    id: string | undefined;
    title: string;
  }) => {
    const existingNote = noteTitles.find((note) => note.id === updatedNote.id);

    if (existingNote) {
      // If the note already exists, update its title
      const updatedNoteTitles = noteTitles.map((note) =>
        note.id === updatedNote.id
          ? { ...note, title: updatedNote.title }
          : note
      );
      setNoteTitles(updatedNoteTitles);
    } else {
      // If the note doesn't exist, add it to the list of note titles
      setNoteTitles([...noteTitles, updatedNote]);

      // Only navigate if we're not already on this note's page
      // This prevents unnecessary navigation that causes editor to lose focus
      if (currentNoteIdRef.current !== updatedNote.id) {
        // Use replace instead of navigate to avoid adding to history
        navigate(`/notebook/${updatedNote.id}`, { replace: true });
      }
    }
  };

  return (
    <div className="flex h-full">
      <NotebookSidebar
        noteTitles={noteTitles}
        isPageLoading={isPageLoading}
        currentNoteId={currentNoteId}
        idToken={user?.getIdToken()}
        setNoteTitles={setNoteTitles}
      />
      <div className="grow">
        <TextEditor
          initialContent={currentNoteContent || ""}
          noteId={currentNoteId}
          updateNoteTitle={updateNoteTitle}
        />
      </div>
    </div>
  );
};

export default Notebook;