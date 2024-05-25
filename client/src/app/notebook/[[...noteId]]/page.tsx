"use client";

import TextEditor from "../components/textEditor/TextEditor";

import { useEffect, useState } from "react";

import { getNoteContentWithNoteId, getNotes } from "../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";

import NotebookSidebar from "../components/sidebar/NotebookSidebar";
import { usePathname, useRouter } from "next/navigation";

const Notebook = ({ params }: { params: { noteId: string } }) => {
  const currentNoteId = params.noteId;
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
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
      router.push(`/notebook/${updatedNote.id}`);
    }
  };

  return (
    <div>
      <div className="flex flex-row">
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
    </div>
  );
};

export default Notebook;
