import {
  BubbleMenu,
  EditorContent,
  mergeAttributes,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MainToolbar from "../toolbars/MainToolbar";
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
      "xl:prose-2xl mx-2 sm:mx-3 md:mx-4 mt-2 sm:mt-3 focus:outline-none " +
      "border p-3 sm:p-4 md:p-5 border-gray-300 min-h-[60vh] sm:min-h-[70vh] " +
      "max-w-full overflow-y-auto rounded-md ",
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

      // auto-save 0.5 seconds after user stops typing
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
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-2 sm:p-3 md:p-5">
        <MainToolbar editor={editor} />
      </div>

      <div className="flex-1">
        <EditorContent editor={editor} />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mx-2 sm:mx-3 md:mx-4 mt-3 sm:mt-4 pb-4 sm:pb-5">
        {/* Save Status Indicator */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          {getSaveStatusIcon()}
          <span className="hidden sm:inline">{getSaveStatusText()}</span>
          <span className="sm:hidden">
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Unsaved'}
          </span>
        </div>

        {/* Manual Save Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleManualSave}
          disabled={saveStatus === 'saving'}
        >
          <SaveIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Save Now</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>
    </div>
  );
};

export default TextEditor;
