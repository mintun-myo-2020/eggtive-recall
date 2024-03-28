import { FormControl, MenuItem, Select } from "@mui/material";
import { Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";

type HeaderSelectorProps = {
  editor: Editor;
};

const buttonClass =
  "flex group items-center justify-center border text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800 dark:hover:bg-white/10 dark:hover:text-neutral-300 dark:active:text-neutral-200 h-8 gap-1 min-w-[2rem] px-2 w-auto";

const isActiveClass = "bg-black/10 text-neutral-800";

const HeaderSelector: React.FC<HeaderSelectorProps> = ({ editor }) => {
  const [currentHeader, setCurrentHeader] = useState("");

  const handleH1 = () => editor.chain().focus().setHeading({ level: 1 }).run();
  const handleH2 = () => editor.chain().focus().setHeading({ level: 2 }).run();
  const handleH3 = () => editor.chain().focus().setHeading({ level: 3 }).run();
  const handleParagraph = () => editor.chain().focus().setParagraph().run();

  useEffect(() => {
    console.log(currentHeader);
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
  
  return (
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
  );
};

export default HeaderSelector;
