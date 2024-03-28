import React, { useCallback, useEffect, useState } from "react";
import { Editor, isActive, useCurrentEditor, useEditor } from "@tiptap/react";
import {
  Bold,
  Code2,
  Highlighter,
  Italic,
  Link,
  Underline,
} from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const buttonClass =
  "flex group items-center justify-center border text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:active:text-neutral-200 h-8 gap-1 min-w-[2rem] px-2 w-auto";

const toolBarClass =
  "mx-2 justify-center text-black inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800";

const isActiveClass = "bg-black/10 text-neutral-800";

type HeadingToolbarProps = {
  editor: Editor | null;
};

const HeadingToolbar: React.FC<HeadingToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [currentHeader, setCurrentHeader] = useState("");

  useEffect(() => {
    const handleHeaderChange = () => {
      if (editor.isActive("heading", { level: 1 })) {
        setCurrentHeader("Title");
      } else if (editor.isActive("heading", { level: 2 })) {
        setCurrentHeader("Header");
      } else if (editor.isActive("heading", { level: 3 })) {
        setCurrentHeader("Subheader");
      } else {
        setCurrentHeader("Paragraph");
      }
    };
    handleHeaderChange();
    editor.on("transaction", handleHeaderChange);
    return () => {
      editor.off("transaction", handleHeaderChange);
    };
  }, [editor]);

  const handleH1 = () => editor.chain().focus().setHeading({ level: 1 }).run();
  const handleH2 = () => editor.chain().focus().setHeading({ level: 2 }).run();
  const handleH3 = () => editor.chain().focus().setHeading({ level: 3 }).run();
  const handleParagraph = () => editor.chain().focus().setParagraph().run();
  const handleBold = () => editor.chain().focus().toggleBold().run();
  const handleItalic = () => editor.chain().focus().toggleItalic().run();
  const handleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const handleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const handleLink = () => {};
  const handleHighlight = () => editor.chain().focus().toggleHighlight().run();
  return (
    <div className={toolBarClass}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
        <Select value={currentHeader}>
          <MenuItem value={"Title"}>
            <span
              onClick={handleH1}
              className={`${buttonClass} ${
                currentHeader === "Title" ? isActiveClass : ""
              }`}
            >
              Title
            </span>
          </MenuItem>
          <MenuItem value={"Header"}>
            <span
              onClick={handleH2}
              className={`${buttonClass} ${
                currentHeader === "Header" ? isActiveClass : ""
              }`}
            >
              Header
            </span>
          </MenuItem>
          <MenuItem value={"Subheader"}>
            <span
              onClick={handleH3}
              className={`${buttonClass} ${
                currentHeader === "Subheader" ? isActiveClass : ""
              }`}
            >
              Subheader
            </span>
          </MenuItem>
          <MenuItem value={"Paragraph"}>
            <span
              onClick={handleParagraph}
              className={`${buttonClass} ${
                currentHeader === "Paragraph" ? isActiveClass : ""
              }`}
            >
              Paragraph
            </span>
          </MenuItem>
        </Select>
      </FormControl>
      <span
        onClick={handleBold}
        className={`${buttonClass} ${
          editor.isActive("bold") ? isActiveClass : ""
        }`}
      >
        <Bold size={14} />
      </span>
      <span
        onClick={handleItalic}
        className={`${buttonClass} ${
          editor.isActive("italic") ? isActiveClass : ""
        }`}
      >
        <Italic size={14} />
      </span>
      <span
        onClick={handleUnderline}
        className={`${buttonClass} ${
          editor.isActive("underline") ? isActiveClass : ""
        }`}
      >
        <Underline size={14} />
      </span>
      <span
        onClick={handleCodeBlock}
        className={`${buttonClass} ${
          editor.isActive("codeblock") ? isActiveClass : ""
        }`}
      >
        <Code2 size={14} />
      </span>
      <span
        onClick={handleLink}
        className={`${buttonClass} ${
          editor.isActive("link") ? isActiveClass : ""
        }`}
      >
        <Link size={14} />
      </span>
      <span
        onClick={handleHighlight}
        className={`${buttonClass} ${
          editor.isActive("highlight") ? isActiveClass : ""
        }`}
      >
        <Highlighter size={14} />
      </span>
    </div>
  );
};

export default HeadingToolbar;
