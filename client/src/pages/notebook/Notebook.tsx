import TextEditor from "../../components/notebook/TextEditor";

import { useEffect, useState } from "react";

import { getNoteContentWithNoteId, getNotes } from "../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { getIdToken } from "firebase/auth";
import { INote } from "../../types/types";
import NotebookSidebar from "../../components/notebook/NotebookSidebar";
import { useNavigate, useParams } from "react-router-dom";

const Notebook = () => {
  const [user, loading, error] = useAuthState(auth);
  const { currentNoteId } = useParams<{ currentNoteId: string | undefined }>();
  const [currentNoteContent, setCurrentNoteContent] = useState<
    string | undefined
  >();

  const [notes, setNotes] = useState<INote[] | undefined>([]);
  const [noteTitles, setNoteTitles] = useState<
    { id: string | undefined; title: string }[]
  >([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const navigate = useNavigate();

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
        setNotes(fetchedNotes);
        const titles = fetchedNotes?.map((note) => ({
          id: note.id,
          title: note.title,
        }));
        if (titles === undefined) {
          setNoteTitles([]);
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

  return (
    <div>
      <div className="flex flex-row">
        <NotebookSidebar
          noteTitles={noteTitles}
          isPageLoading={isPageLoading}
          currentNoteId={currentNoteId}
        />
        <div className="grow ">
          <TextEditor initialContent={currentNoteContent || ""} />
        </div>
      </div>
    </div>
  );
};

export default Notebook;
