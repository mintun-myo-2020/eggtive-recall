import {
  BubbleMenu,
  EditorContent,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HeadingToolbar from "../toolbars/HeadingToolbar";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { EditorProps } from "@tiptap/pm/view";
import BubbleToolbar from "../toolbars/BubbleToolbar";
import { useEffect, useRef, useState } from "react";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import { saveNote } from "../../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";
import { Spinner } from "flowbite-react";

const CustomDocument = Document.extend({
  content: "heading block*",
});

const extensions = [
  CustomDocument,
  StarterKit.configure({
    document: false,
    heading: false,
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  Link.configure({
    openOnClick: true,
    autolink: true,
  }),
  Heading.extend({
    levels: [1, 2, 3],
    renderHTML({ node, HTMLAttributes }) {
      const level: number = this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : this.options.levels[0];
      const classes: { [index: number]: string } = {
        1: "text-3xl",
        2: "text-2xl",
        3: "text-xl",
      };
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          class: `${classes[level]}`,
        }),
        0,
      ];
    },
  }).configure({ levels: [1, 2, 3] }),
];

const editorClass: EditorProps = {
  attributes: {
    class:
      "prose dark:prose-invert " +
      "prose-sm sm:prose-base lg:prose-lg " +
      "xl:prose-2xl md:ml-2 mt-1 md:mr-2 focus:outline-none " +
      "border p-4 pr-0 md:pr-2 border-gray-400 min-h-[12rem] " +
      "max-w-screen overflow-y-auto rounded-md ",
  },
};

type TextAreaProps = {
  initialContent: string;
  noteId: string | undefined;
  updateNoteTitle: (updatedNote: {
    id: string | undefined;
    title: string;
  }) => void;
};

const TextEditor: React.FC<TextAreaProps> = ({
  initialContent,
  noteId,
  updateNoteTitle,
}) => {
  const [user, loading, error] = useAuthState(auth);

  const [editorContent, setEditorContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditor({
    extensions,
    autofocus: true,
    content: editorContent,
    editorProps: editorClass,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (initialContent !== undefined) {
      editor?.commands.setContent(initialContent);
      setIsLoading(false);
    }
  }, [initialContent]);

  const handleSave = async () => {
    const idToken = await user?.getIdToken();
    const userId = user?.uid;

    const res = await saveNote(editorContent, userId, idToken, noteId);
    if (res === undefined) {
      return;
    }
    const newNoteId = res.id; // get the id of the new note from the response
    const newNote = { id: newNoteId, title: res.title };
    updateNoteTitle(newNote);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid md:p-5 ">
      <HeadingToolbar editor={editor} />
      <EditorContent editor={editor} />

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
