import TextEditor from "../../components/notebook/TextEditor";

import { useEffect, useState } from "react";
import { NotebookIcon } from "lucide-react";
import { Sidebar } from "flowbite-react/lib/esm/components/Sidebar";
import { API_BASE_URL, API_ENDPOINTS } from "../../api/endpoints";
import { getNotes } from "../../api/cardApiUtils";

const Notebook = () => {
  const [noteTitles, setNoteTitles] = useState<String[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notes = await getNotes();
        console.log(notes);
        if (notes === undefined || notes === null) {
          setNoteTitles([]);
        } else {
          const titles = notes.map((note) => note.title);
          setNoteTitles(titles);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-row">
        <div className="hidden sm:flex flex-none max-w-32 mr-5 h-dvh">
          <Sidebar collapseBehavior="collapse" collapsed={false}>
            <Sidebar.Items>
              {noteTitles.map((noteTitle, i) => (
                <Sidebar.ItemGroup key={i}>{noteTitle.slice(10)}</Sidebar.ItemGroup>
              ))}
            </Sidebar.Items>
          </Sidebar>
        </div>

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
        </div>
        <div className="grow">
          <TextEditor content={"initial"} />
        </div>
      </div>
    </div>
  );
};

export default Notebook;
