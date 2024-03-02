import TextArea from "../../components/notebook/TextArea";

import { useEffect, useState } from "react";
import { InboxIcon, Mail, MailIcon } from "lucide-react";
import { Sidebar } from "flowbite-react/lib/esm/components/Sidebar";
import { useCurrentEditor } from "@tiptap/react";

const drawerWidth = 240;

const Notebook = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { editor } = useCurrentEditor();

  const handleSave = () => {
    console.log(editor?.getHTML);
  };
  return (
    <div>
      <div className="flex flex-row">
        <div className="hidden sm:flex flex-none max-w-32 mr-5">
          <Sidebar collapseBehavior="collapse" collapsed={false}>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="#" icon={Mail}>
                  Dashboard
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>

        <div className="sm:hidden flex-none">
          <Sidebar collapseBehavior="collapse" collapsed={true}>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="#" icon={Mail}>
                  Dashboard
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
        <div className="grow">
          <TextArea content={"initial"} />
        </div>
      </div>


    </div>
  );
};

export default Notebook;
