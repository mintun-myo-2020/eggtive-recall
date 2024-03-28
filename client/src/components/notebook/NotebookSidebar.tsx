import { Sidebar } from "flowbite-react/lib/esm/components/Sidebar";
import { NotebookIcon } from "lucide-react";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";

type SidebarProps = {
  noteTitles: Array<{ id: string | undefined; title: string }>;
  isPageLoading: boolean;
  currentNoteId?: string;
  onNoteClick?: (id: string | undefined) => void;
};

const NotebookSidebar: React.FC<SidebarProps> = ({
  noteTitles,
  isPageLoading,
  currentNoteId,
  onNoteClick,
}) => {
  const navigate = useNavigate();
  const handleClick = (id: string | undefined) => {
    if (id) {
      console.log(currentNoteId);
      navigate(`/notebook/${id}`);
    }
  };

  const SidebarSection = ({ collapsed }: { collapsed: boolean }) => (
    <Sidebar collapseBehavior="collapse" collapsed={collapsed}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {noteTitles.map(({ id, title }) => (
            <Sidebar.Item
              key={id}
              onClick={() => handleClick(id)}
              className={`cursor-pointer hover:bg-gray-200 rounded-sm min-h-3 h-full py-0.5 ${
                id === currentNoteId ? "bg-gray-300" : ""
              }`}
            >
              {title.slice(0, 10)}
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );

  return (
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
  );
};

export default NotebookSidebar;