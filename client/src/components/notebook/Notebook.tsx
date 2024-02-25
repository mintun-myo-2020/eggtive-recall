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
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { EditorProps } from "@tiptap/pm/view";

const extensions = [
  StarterKit,
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  CodeBlock.configure({}),
  Link.configure({
    openOnClick: true,
    autolink: true,
  }),
  Highlight,
];
const content = "";

const editorClass: EditorProps = {
  attributes: {
    class:
      "prose dark:prose-invert " +
      "prose-sm sm:prose-base lg:prose-lg " +
      "xl:prose-2xl m-5 focus:outline-none " +
      "border p-4 border-gray-400 min-h-[12rem] " +
      "max-h-[12rem] overflow-y-auto max-w-none ",
  },
};

const Notebook = () => {
  return (
    <EditorProvider
      extensions={extensions}
      slotBefore={<HeadingToolbar />}
      content={content}
      autofocus={true}
      editorProps={editorClass}
    >
      <FloatingMenu> </FloatingMenu>
      {/* <BubbleMenu>BubbleMenu</BubbleMenu> */}
    </EditorProvider>
  );
};

export default Notebook;
