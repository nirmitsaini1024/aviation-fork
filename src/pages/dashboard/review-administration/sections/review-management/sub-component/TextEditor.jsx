import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Type,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  Eraser,
  Palette,
  Save,
  Pencil,
} from "lucide-react";
import { ReviewManagementContext } from "../Context/ReviewManagementProvider";
import { useContext, useEffect, useState } from "react";
import "../styles/tiptap-editor.css";
import { Markdown } from "tiptap-markdown";

const MenuBar = ({
  editAfterSave,
  chapterId,
  setEditChapterId = () => {},
  setHasUnsavedChanges = () => {},
  setOriginalContent = () => {},
}) => {
  const { editor } = useCurrentEditor();
  const {
    chapterDescription,
    setChapterDescription,
    showAllChapters,
    setShowAllChapters,
    setEditChapter,
  } = useContext(ReviewManagementContext);

  if (!editor) {
    return null;
  }

  // Fixed button handler with proper focus management
  const handleButtonClick = (command) => {
    if (!editor || !editor.isFocused) {
      // Focus first, then execute command after a tiny delay
      editor.commands.focus();
      setTimeout(() => {
        command();
      }, 10);
    } else {
      // Editor is already focused, execute immediately
      command();
    }
  };

  const handleSave = () => {
    const json = editor.getJSON();
    const text = editor.getText().replace(/\n\n/g, "\n");
    navigator.clipboard.writeText(text);
    const html = editor.getHTML();
    const markdown = editor.storage.markdown.getMarkdown();
    console.log("Markdown file is: ", markdown);

    console.log({ json, text, html, markdown });
    editor.commands.clearContent();
    setChapterDescription("");
    setShowAllChapters((prev) => [
      ...prev,
      {
        title: chapterDescription,
        id: showAllChapters.length + 1,
        json,
        text,
        html,
        markdown,
      },
    ]);
  };

  const handleSaveAfterEdit = () => {
    if (chapterId === null) return;
    console.log("Chapter id is: ", chapterId);
    const json = editor.getJSON();
    const text = editor.getText().replace(/\n\n/g, "\n");
    navigator.clipboard.writeText(text);
    const html = editor.getHTML();
    const markdown = editor.storage.markdown.getMarkdown();

    setShowAllChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              json,
              text,
              html,
              markdown,
            }
          : chapter
      )
    );

    // Reset edit state and update original content
    setEditChapterId(null);
    setHasUnsavedChanges(false);
    setOriginalContent(markdown);
    setEditChapter(false);
  };

  const ButtonGroup = ({ children, label }) => (
    <div className="button-group">
      {label && <span className="group-label">{label}</span>}
      <div className="buttons">{children}</div>
    </div>
  );

  const Button = ({ onClick, disabled, isActive, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`editor-btn ${isActive ? "active" : ""} ${
        disabled ? "disabled" : ""
      }`}
      title={title}
      // Prevent default to avoid focus issues
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );

  return (
    <div className="menu-bar">
      <ButtonGroup label="Format">
        <Button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleBold().run())
          }
          disabled={!editor.can().chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleItalic().run())
          }
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleStrike().run())
          }
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleCode().run())
          }
          disabled={!editor.can().chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={16} />
        </Button>
      </ButtonGroup>

      <ButtonGroup label="Headings">
        <Button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().setParagraph().run())
          }
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Type size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            )
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            )
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            )
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </Button>
      </ButtonGroup>

      <ButtonGroup label="Lists">
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleBulletList().run()
            )
          }
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleOrderedList().run()
            )
          }
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </Button>
      </ButtonGroup>

      <ButtonGroup label="Blocks">
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleCodeBlock().run()
            )
          }
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().toggleBlockquote().run()
            )
          }
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote size={16} />
        </Button>
        <Button
          onClick={() =>
            handleButtonClick(() =>
              editor.chain().focus().setHorizontalRule().run()
            )
          }
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </Button>
      </ButtonGroup>
      <ButtonGroup label="Actions">
          <Button
            onClick={() =>
              handleButtonClick(() =>
                editor.chain().focus().setColor("#0096FF").run()
              )
            }
            isActive={editor.isActive("textStyle", { color: "#0096FF" })}
            title="Blue Text"
          >
            <Palette size={16} />
          </Button>
          <Button
            onClick={() =>
              handleButtonClick(() =>
                editor.chain().focus().unsetAllMarks().run()
              )
            }
            title="Clear Formatting"
          >
            <Eraser size={16} />
          </Button>
          <Button
            onClick={() =>
              handleButtonClick(() => editor.chain().focus().undo().run())
            }
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            onClick={() =>
              handleButtonClick(() => editor.chain().focus().redo().run())
            }
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            <Redo2 size={16} />
          </Button>
        </ButtonGroup>

      <div className="mt-auto">
        {editAfterSave ? (
          <button
            onClick={handleSaveAfterEdit}
            disabled={editor.getText().length === 0}
            className={`flex  gap-x-1  ease-in-out duration-300 transition-all px-6 max-h-fit py-2 items-center rounded-md  ${
              editor.getText().length === 0
                ? "bg-blue-400"
                : "hover:bg-blue-600 bg-blue-500 hover:cursor-pointer hover:shadow-lg"
            } text-white`}
          >
            {" "}
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={
              editor.getText().length === 0 || chapterDescription.length === 0
            }
            className={`flex  gap-x-1  ease-in-out duration-300 transition-all px-6  py-2 items-center rounded-md  ${
              editor.getText().length === 0 || chapterDescription.length === 0
                ? "bg-blue-400"
                : "hover:bg-blue-600 bg-blue-500 hover:cursor-pointer hover:shadow-lg"
            } text-white`}
          >
            {" "}
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        )}
      </div>
    </div>
  );
};

const extensions = [
  Markdown,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `What's the title?`;
      }
      return "Add your chapter details here...";
    },
    includeChildren: true,
  }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "tiptap-bullet-list",
      },
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      HTMLAttributes: {
        class: "tiptap-ordered-list",
      },
      keepMarks: true,
      keepAttributes: false,
    },
    listItem: {
      HTMLAttributes: {
        class: "tiptap-list-item",
      },
    },
  }),
];

export default function TipTap({
  openAccordion = null,
  editAfterSave = false,
  chapterId = null,
  content,
  isEditModeOn = true,
  setEditChapterId = () => {},
  editChapterId = null,
}) {
  const [originalContent, setOriginalContent] = useState(content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const { setEditChapter } = useContext(ReviewManagementContext);

  useEffect(() => {
    setOriginalContent(content);
    setHasUnsavedChanges(false);
  }, [content]);

  // Track content changes
  const handleContentChange = ({ editor }) => {
    if (editChapterId === chapterId) {
      const currentContent = editor.storage.markdown.getMarkdown();
      setHasUnsavedChanges(currentContent !== originalContent);
    }
  };

  return (
    <div
      className={`editor-container scroll-container ${
        openAccordion && "cursor-text"
      }`}
    >
      <EditorProvider
        slotBefore={
          <MenuBar
            editAfterSave={editAfterSave}
            chapterId={chapterId}
            setEditChapterId={setEditChapterId}
            setHasUnsavedChanges={setHasUnsavedChanges}
            setOriginalContent={setOriginalContent}
          />
        }
        extensions={extensions}
        content={content}
        editable={isEditModeOn}
        onUpdate={handleContentChange}
        onCreate={({ editor }) => setEditorInstance(editor)}
      />

     {
      chapterId && (
         <button
        onClick={(e) => {
          e.stopPropagation();
          setEditChapter(false);
        }}
        className="absolute z-50 top-4 right-4 p-2 hover:text-blue-700 text-blue-500"
      >
        <Pencil size={16} />
      </button>
      )
     }
    </div>
  );
}
