import { NotebookIcon, TrashIcon } from "lucide-react";
import { Sidebar, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/utils/api/noteApiUtils";

type SidebarProps = {
  noteTitles: Array<{ id: string | undefined; title: string }>;
  isPageLoading: boolean;
  currentNoteId?: string;
  idToken: Promise<string> | undefined;
  setNoteTitles: React.Dispatch<
    React.SetStateAction<
      {
        id: string | undefined;
        title: string;
      }[]
    >
  >;
};

const NotebookSidebar: React.FC<SidebarProps> = ({
  noteTitles,
  isPageLoading,
  currentNoteId,
  idToken,
  setNoteTitles,
}) => {
  const router = useRouter();

  const handleSelectNote = (currentNoteId: string | undefined) => {
    if (currentNoteId) {
      router.push(`/notebook/${currentNoteId}`);
    }
  };

  const handleDelete = async (noteIdToDelete: string | undefined) => {
    const userConfirmation = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (userConfirmation) {
      console.log("Deleting note with id: ", noteIdToDelete);
      const resolvedIdToken = await idToken;
      await deleteNote(noteIdToDelete, resolvedIdToken);

      const updatedNotes = noteTitles.filter(
        (note) => note.id !== noteIdToDelete
      );
      setNoteTitles(updatedNotes);
    }
  };

  const SidebarSection = ({ collapsed }: { collapsed: boolean }) => (
    <Sidebar collapseBehavior="collapse" collapsed={collapsed}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {noteTitles.map(({ id, title }) => (
            <div key={id} className="flex items-center justify-end">
              <Sidebar.Item
                key={"item_" + id}
                onClick={() => handleSelectNote(id)}
                className={`cursor-pointer rounded-sm min-h-5 h-full py-0.5 ${
                  id === currentNoteId ? "bg-gray-300" : ""
                }`}
              >
                {title.slice(0, 10)}
              </Sidebar.Item>
              <div
                key={"trash_" + id}
                className="cursor-pointer"
                onClick={() => handleDelete(id)}
              >
                <TrashIcon size={16} />
              </div>
            </div>
          ))}
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            onClick={() => router.push("/notebook")}
            icon={NotebookIcon}
            className="cursor-pointer"
          >
            New Note
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );

  return (
    <>
      <div>
        {isPageLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="hidden sm:flex flex-none max-w-32 mr-5 h-dvh">
            <SidebarSection collapsed={false} />
          </div>
        )}

        {isPageLoading ? (
          <div className="flex justify-center items-center">
            <Spinner className="sm:hidden my-auto" />
          </div>
        ) : (
          <div className="sm:hidden flex-none h-dvh">
            <SidebarSection collapsed={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default NotebookSidebar;
