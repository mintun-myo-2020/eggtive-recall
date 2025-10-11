import React, { useCallback, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Code2,
  Highlighter,
  Italic,
  Link,
  Underline,
} from "lucide-react";
import HeaderSelector from "./toolbarComponents/HeaderSelector";

const buttonClass =
  "flex group items-center justify-center border text-xs sm:text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:active:text-neutral-200 h-7 sm:h-8 gap-0.5 sm:gap-1 min-w-[1.75rem] sm:min-w-[2rem] px-1.5 sm:px-2 w-auto";

const toolBarClass =
  "justify-center text-black inline-flex h-full leading-none gap-0.5 sm:gap-1 flex-row p-1 sm:p-1.5 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800";

const isActiveClass = "bg-black/10 text-neutral-800";

type MainToolbarProps = {
  editor: Editor | null;
};

const MainToolbar: React.FC<MainToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }


  const handleBold = () => editor.chain().focus().toggleBold().run();
  const handleItalic = () => editor.chain().focus().toggleItalic().run();
  const handleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const handleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const handleLink = () => { };
  const handleHighlight = () => editor.chain().focus().toggleHighlight().run();
  return (
    <div className="flex justify-center w-full">
      <div className={toolBarClass}>
        <HeaderSelector editor={editor} />
        <span
          onClick={handleBold}
          className={`${buttonClass} ${editor.isActive("bold") ? isActiveClass : ""
            }`}
        >
          <Bold className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={handleItalic}
          className={`${buttonClass} ${editor.isActive("italic") ? isActiveClass : ""
            }`}
        >
          <Italic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={handleUnderline}
          className={`${buttonClass} ${editor.isActive("underline") ? isActiveClass : ""
            }`}
        >
          <Underline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={handleCodeBlock}
          className={`${buttonClass} ${editor.isActive("codeblock") ? isActiveClass : ""
            }`}
        >
          <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={handleLink}
          className={`${buttonClass} ${editor.isActive("link") ? isActiveClass : ""
            }`}
        >
          <Link className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
        <span
          onClick={handleHighlight}
          className={`${buttonClass} ${editor.isActive("highlight") ? isActiveClass : ""
            }`}
        >
          <Highlighter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
      </div>
    </div>
  );
};

export default MainToolbar;
