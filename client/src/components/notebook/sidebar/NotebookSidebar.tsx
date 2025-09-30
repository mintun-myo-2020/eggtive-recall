import { NotebookIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { deleteNote } from "../../../api/noteApiUtils";

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
  const navigate = useNavigate();

  const handleSelectNote = (currentNoteId: string | undefined) => {
    if (currentNoteId) {
      navigate(`/notebook/${currentNoteId}`);
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

  const SidebarContent = () => (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <NotebookIcon size={20} />
          Notes
        </h2>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {noteTitles.map(({ id, title }) => (
            <div
              key={id}
              className={`group flex items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${id === currentNoteId
                ? "bg-blue-50 border border-blue-200"
                : "border border-transparent"
                }`}
              onClick={() => handleSelectNote(id)}
            >
              <div className="flex-1 min-w-0 max-w-[180px] overflow-hidden pr-2">
                <p
                  className={`text-sm font-medium truncate ${id === currentNoteId ? "text-blue-700" : "text-gray-700"
                    }`}
                  title={title || "Untitled Note"} // Show full title on hover
                >
                  {title || "Untitled Note"}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-all flex-shrink-0 w-6 h-6 flex items-center justify-center"
              >
                <TrashIcon size={12} className="text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => navigate("/notebook")}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={16} />
          New Note
        </button>
      </div>
    </div>
  );

  if (isPageLoading) {
    return (
      <div className="w-64 h-full flex justify-center items-center bg-white border-r border-gray-200">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - You might want to implement a drawer/modal for mobile */}
      <div className="sm:hidden w-16 h-full">
        <div className="bg-white border-r border-gray-200 h-full flex flex-col items-center py-4">
          <button
            onClick={() => navigate("/notebook")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <NotebookIcon size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotebookSidebar; 
