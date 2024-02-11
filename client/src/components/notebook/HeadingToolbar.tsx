import { useCurrentEditor } from "@tiptap/react";
import React from "react";

const HeadingToolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div>
      {" "}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
    </div>
  );
};

export default HeadingToolbar;
