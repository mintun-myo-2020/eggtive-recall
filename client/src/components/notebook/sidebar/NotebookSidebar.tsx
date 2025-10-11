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

  if (isPageLoading) {
    return (
      <div className="w-16 sm:w-48 md:w-56 lg:w-64 flex-shrink-0 h-full flex justify-center items-center bg-gray-50 border-r border-gray-200">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-16 sm:w-48 md:w-56 lg:w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-2 sm:p-3 md:p-4 border-b border-gray-200 bg-white">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center justify-center gap-1 sm:gap-2">
          <NotebookIcon className="hidden w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sm:inline">Notes</span>
        </h2>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-1 sm:p-2 md:p-3">
        <div className="space-y-1">
          {noteTitles.map(({ id, title }) => (
            <div
              key={id}
              className={`group flex items-center p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${id === currentNoteId
                  ? "bg-blue-100 border border-blue-300"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              onClick={() => handleSelectNote(id)}
              title={title || "Untitled Note"}
            >
              <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                <p
                  className={`text-xs sm:text-sm font-medium truncate ${id === currentNoteId ? "text-blue-700" : "text-gray-700"
                    }`}
                >
                  <span className="hidden sm:inline">{title || "Untitled Note"}</span>
                  <span className="sm:hidden">
                    <NotebookIcon className="w-4 h-4" />
                  </span>
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 rounded hover:bg-red-100 transition-all flex-shrink-0"
              >
                <TrashIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-2 sm:p-3 md:p-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => navigate("/notebook")}
          className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>
    </div>
  );
};

export default NotebookSidebar; 
