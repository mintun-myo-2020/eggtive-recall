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
import { EditorState } from "@tiptap/pm/state";
import { useRef, useState } from "react";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const extensions = [
  CustomDocument,
  StarterKit.configure({
    document: false,
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  Link.configure({
    openOnClick: true,
    autolink: true,
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
];

const editorClass: EditorProps = {
  attributes: {
    class:
      "prose dark:prose-invert " +
      "prose-sm sm:prose-base lg:prose-lg " +
      "xl:prose-2xl mx-2 mt-1 focus:outline-none " +
      "border p-4 border-gray-400 min-h-[12rem] " +
      "max-w-screen overflow-y-auto rounded-md ",
  },
};

type TextAreaProps = {
  content: string;
};

const TextEditor: React.FC<TextAreaProps> = ({ content }) => {
  const [editorContent, setEditorContent] = useState(content);

  const handleSave = () => {
    console.log(editorContent);
  };

  return (
    <div className="grid p-5 ">
      <EditorProvider
        extensions={extensions}
        slotBefore={<HeadingToolbar />}
        content={editorContent}
        autofocus={true}
        editorProps={editorClass}
        onUpdate={({ editor }) => {
          setEditorContent(editor.getHTML());
        }}
      >
        <BubbleMenu>
          <BubbleToolbar />
        </BubbleMenu>
      </EditorProvider>

      <button
        type="button"
        className="pageBtn m-2 max-w-16px justify-self-end"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default TextEditor;
