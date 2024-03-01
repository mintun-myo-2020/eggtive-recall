import {
  BubbleMenu,
  EditorContent,
  EditorContentProps,
  EditorProvider,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HeadingToolbar from "./HeadingToolbar";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { EditorProps } from "@tiptap/pm/view";
import BubbleToolbar from "./BubbleToolbar";

const extensions = [
  StarterKit,
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  Link.configure({
    openOnClick: true,
    autolink: true,
  }),
];
const content = "";

const editorClass: EditorProps = {
  attributes: {
    class:
      "prose dark:prose-invert " +
      "prose-sm sm:prose-base lg:prose-lg " +
      "xl:prose-2xl mx-2 focus:outline-none " +
      "border p-4 border-gray-400 min-h-[12rem] " +
      "max-w-screen overflow-y-auto ",
  },
};

const handleSave = () => {
  
}

const Notebook = () => {
  return (
    <div className="grid">
      <EditorProvider
        extensions={extensions}
        slotBefore={<HeadingToolbar />}
        content={content}
        autofocus={true}
        editorProps={editorClass}
      >
        <BubbleMenu>
          <BubbleToolbar />
        </BubbleMenu>
      </EditorProvider>

      <button type="button" className="pageBtn m-2 w-1/12 justify-self-end  ">Save</button>
    </div>
  );
};

export default Notebook;
