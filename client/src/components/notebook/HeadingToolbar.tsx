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

const HeadingToolbar: React.FC = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const [currentHeader, setCurrentHeader] = useState("");

  const handleChangeHeader = (event: SelectChangeEvent) => {
    if (editor.isActive("heading", { level: 1 })) {
      setCurrentHeader("Header 1");
    } else if (editor.isActive("heading", { level: 2 })) {
      setCurrentHeader("Header 2");
    } else if (editor.isActive("heading", { level: 3 })) {
      setCurrentHeader("Header 3");
    } else {
      setCurrentHeader("");
    }
  };

  useEffect(() => {
    handleChangeHeader;
  }, [editor]);

  const handleH1 = () => editor.chain().focus().setHeading({ level: 1 }).run();
  const handleH2 = () => editor.chain().focus().setHeading({ level: 2 }).run();
  const handleH3 = () => editor.chain().focus().setHeading({ level: 3 }).run();
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
          <MenuItem value={"Header 1"}>
            <span
              onClick={handleH1}
              className={`${buttonClass} ${
                editor.isActive("heading", { level: 1 }) ? isActiveClass : ""
              }`}
            >
              Header 1
            </span>
          </MenuItem>
          <MenuItem value={"Header 2"}>
            <span
              onClick={handleH2}
              className={`${buttonClass} ${
                editor.isActive("heading", { level: 2 }) ? isActiveClass : ""
              }`}
            >
              Header 2
            </span>
          </MenuItem>
          <MenuItem value={"Header 3"}>
            <span
              onClick={handleH3}
              className={`${buttonClass} ${
                editor.isActive("heading", { level: 3 }) ? isActiveClass : ""
              }`}
            >
              Header 3
            </span>
          </MenuItem>
          <MenuItem value={""}>
            <span
              className={`${buttonClass} ${
                editor.isActive("heading", { level: 4 }) ? isActiveClass : ""
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
