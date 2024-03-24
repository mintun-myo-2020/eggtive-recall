import TextEditor from "../../components/notebook/TextEditor";

import { useEffect, useState } from "react";
import { NotebookIcon } from "lucide-react";
import { Sidebar } from "flowbite-react/lib/esm/components/Sidebar";

import { getNotes } from "../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import { getIdToken } from "firebase/auth";
import { Spinner } from "flowbite-react";
import { INote } from "../../types/types";

const Notebook = () => {
  const [user, loading, error] = useAuthState(auth);


  const [notes, setNotes] = useState<INote[] | undefined>([]);
  const [noteTitles, setNoteTitles] = useState<String[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

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
        const titles = fetchedNotes?.map((note) => note.title);
        if (titles === undefined) {
          setNoteTitles([]);
        } else {
          console.log(titles);
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

        {isPageLoading ?
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
          :
          <div className="hid</div>den sm:flex flex-none max-w-32 mr-5 h-dvh">
            <Sidebar collapseBehavior="collapse" collapsed={false}>
              <Sidebar.Items>
                {noteTitles.map((noteTitle, i) => (
                  <Sidebar.ItemGroup key={i}>{noteTitle.slice(0, 10)}</Sidebar.ItemGroup>
                ))}
              </Sidebar.Items>
            </Sidebar>
          </div>}

        {isPageLoading ?
          <div className="flex justify-center items-center"> <Spinner className="sm:hidden my-auto" /> </div>
          :
          <div className="sm:hidden flex-none">
            <Sidebar collapseBehavior="collapse" collapsed={true}>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#" icon={NotebookIcon}>
                    Dashboard
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>}

        <div className="grow">
          <TextEditor content={notes?.[0]?.content || ""} />
        </div>
      </div>
    </div>
  );
};

export default Notebook;
