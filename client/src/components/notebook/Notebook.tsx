import { BubbleMenu, EditorProvider, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HeadingToolbar from "./HeadingToolbar";

const extensions = [StarterKit];

const Notebook = () => {
  return (
    <EditorProvider extensions={extensions} slotBefore={<HeadingToolbar />}>
      <FloatingMenu>asd</FloatingMenu>
      <BubbleMenu>BubbleMenu</BubbleMenu>
    </EditorProvider>
  );
};

export default Notebook;
