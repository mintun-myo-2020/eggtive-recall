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
import { useEffect, useRef, useState, useCallback } from "react";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import { saveNote } from "../../../api/noteApiUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";
import { Spinner } from "flowbite-react";
import { CheckIcon, CloudIcon, SaveIcon } from "lucide-react";

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

type SaveStatus = 'saved' | 'saving' | 'unsaved';

const TextEditor: React.FC<TextAreaProps> = ({
  initialContent,
  noteId,
  updateNoteTitle,
}) => {
  const [user, loading, error] = useAuthState(auth);

  const [editorContent, setEditorContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    (content: string) => {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set status to unsaved immediately
      setSaveStatus('unsaved');

      // Set new timeout for auto-save (2 seconds after user stops typing)
      autoSaveTimeoutRef.current = setTimeout(async () => {
        if (content.trim() && user) {
          setSaveStatus('saving');
          try {
            const idToken = await user.getIdToken();
            const userId = user.uid;
            const res = await saveNote(content, userId, idToken, noteId);
            
            if (res) {
              const newNote = { id: res.id, title: res.title };
              updateNoteTitle(newNote);
              setSaveStatus('saved');
            }
          } catch (error) {
            console.error('Auto-save failed:', error);
            setSaveStatus('unsaved');
          }
        }
      }, 2000); // 2 second delay
    },
    [user, noteId, updateNoteTitle]
  );

  const editor = useEditor({
    extensions,
    autofocus: true,
    content: editorContent,
    editorProps: editorClass,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setEditorContent(content);
      debouncedAutoSave(content);
    },
  });

  useEffect(() => {
    if (initialContent !== undefined && editor) {
      // Only update content if it's different from current content
      const currentContent = editor.getHTML();
      if (currentContent !== initialContent) {
        editor.commands.setContent(initialContent);
      }
      setIsLoading(false);
      setSaveStatus('saved');
    }
  }, [initialContent, editor]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const handleManualSave = async () => {
    if (!user || !editorContent.trim()) return;

    setSaveStatus('saving');
    try {
      const idToken = await user.getIdToken();
      const userId = user.uid;
      const res = await saveNote(editorContent, userId, idToken, noteId);
      
      if (res) {
        const newNote = { id: res.id, title: res.title };
        updateNoteTitle(newNote);
        setSaveStatus('saved');
        
        // Clear any pending auto-save
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
      }
    } catch (error) {
      console.error('Manual save failed:', error);
      setSaveStatus('unsaved');
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Spinner size="sm" />;
      case 'saved':
        return <CheckIcon size={16} className="text-green-600" />;
      case 'unsaved':
        return <CloudIcon size={16} className="text-orange-500" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'unsaved':
        return 'Unsaved changes';
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid md:p-5 ">
      <HeadingToolbar editor={editor} />
      <EditorContent editor={editor} />

      <div className="flex items-center justify-between m-2">
        {/* Save Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getSaveStatusIcon()}
          <span>{getSaveStatusText()}</span>
        </div>

        {/* Manual Save Button */}
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleManualSave}
          disabled={saveStatus === 'saving'}
        >
          <SaveIcon size={16} />
          Save Now
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
