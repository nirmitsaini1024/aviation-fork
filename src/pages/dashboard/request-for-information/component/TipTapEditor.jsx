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
import "../styles/tiptap-editor.css";
import { Markdown } from "tiptap-markdown";
import { useContext } from "react";
import { RequestInfoContext } from "../context/RequestInfoContext";

const MenuBar = ({ type }) => {
  const {
    setExternalInformationForTipTap,
    setEditExternalResource,
    setShowInternalResourceAnswerInTipTap,
   setIsEditInternalAnswer
  } = useContext(RequestInfoContext);
  const { editor } = useCurrentEditor();
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

  const getHTMLWithCSS = () => {
    const html = editor.getHTML();

    // Define your TipTap styles
    const tiptapCSS = `
    /* Base Container Styles */
.ProseMirror {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1e293b;
  background: white;
  padding: 20px;
  outline: none;
  min-height: 200px;
}

.tiptap {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  line-height: 1.6;
  color: #1e293b;
  background: white;
  padding: 0px 24px 24px 24px;
  min-height: 400px;
  outline: none;
}

.tiptap:first-child {
  margin-top: 0;
}

/* Heading Styles */
.ProseMirror h1,
.tiptap h1,
h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

.ProseMirror h1:first-child,
.tiptap h1:first-child,
h1:first-child {
  margin-top: 0;
}

.ProseMirror h2,
.tiptap h2,
h2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

.ProseMirror h3,
.tiptap h3,
h3 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

.ProseMirror h4,
.tiptap h4,
h4 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

.ProseMirror h5,
.tiptap h5,
h5 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

.ProseMirror h6,
.tiptap h6,
h6 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 2rem 0 0.75rem 0;
  color: #0f172a;
  page-break-after: avoid;
}

/* Paragraph Styles */
.ProseMirror p,
.tiptap p,
p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #374151;
  orphans: 3;
  widows: 3;
}

/* Text Formatting Styles */
.ProseMirror strong,
.tiptap strong,
strong {
  font-weight: 600;
  color: #0f172a;
}

.ProseMirror em,
.tiptap em,
em {
  font-style: italic;
  color: #475569;
}

.ProseMirror s,
.tiptap s,
s {
  text-decoration: line-through;
  color: #6b7280;
}

.ProseMirror u,
.tiptap u,
u {
  text-decoration: underline;
  color: inherit;
}

.ProseMirror mark,
.tiptap mark,
mark {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

/* Code Styles */
.ProseMirror code,
.tiptap code,
code {
  background-color: #f1f5f9;
  color: #e11d48;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-family: "Monaco", "Consolas", "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.875em;
  font-weight: 500;
}

.ProseMirror pre,
.tiptap pre,
pre {
  background: #1e293b;
  border-radius: 8px;
  color: #e2e8f0;
  font-family: "Monaco", "Consolas", "JetBrains Mono", "Fira Code", monospace;
  margin: 1.5rem 0;
  padding: 1.25rem;
  overflow-x: auto;
  border: 1px solid #334155;
  page-break-inside: avoid;
  white-space: pre-wrap;
  font-size: 0.875rem;
  line-height: 1.5;
}

.ProseMirror pre code,
.tiptap pre code,
pre code {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
}

/* List Styles */
.ProseMirror ul,
.tiptap ul,
ul,
.tiptap-bullet-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
  display: block;
}

.ProseMirror ol,
.tiptap ol,
ol,
.tiptap-ordered-list {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 1rem 0;
  display: block;
}

.ProseMirror li,
.tiptap li,
li,
.tiptap-list-item {
  margin: 0.25rem 0;
  display: list-item;
  list-style-type: inherit;
  page-break-inside: avoid;
}

.ProseMirror li p,
.tiptap li p,
li p {
  margin: 0.25rem 0;
}

/* Nested List Styles */
.ProseMirror ul ul,
.tiptap ul ul,
ul ul {
  list-style-type: circle;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.ProseMirror ul ul ul,
.tiptap ul ul ul,
ul ul ul {
  list-style-type: square;
}

.ProseMirror ol ol,
.tiptap ol ol,
ol ol {
  list-style-type: lower-alpha;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.ProseMirror ol ol ol,
.tiptap ol ol ol,
ol ol ol {
  list-style-type: lower-roman;
}

/* Tight Lists (for data-tight="true") */
.tight li {
  color: red;
}

.tight li p {

}

/* Blockquote Styles */
.ProseMirror blockquote,
.tiptap blockquote,
blockquote {
  border-left: 4px solid #3b82f6;
  background: #f8fafc;
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #475569;
  page-break-inside: avoid;
}

.ProseMirror blockquote p,
.tiptap blockquote p,
blockquote p {
  margin: 0.5rem 0;
}

.ProseMirror blockquote p:first-child,
.tiptap blockquote p:first-child,
blockquote p:first-child {
  margin-top: 0;
}

.ProseMirror blockquote p:last-child,
.tiptap blockquote p:last-child,
blockquote p:last-child {
  margin-bottom: 0;
}

.ProseMirror hr,
.tiptap hr,
hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 2rem 0;
  border-radius: 1px;
  page-break-after: avoid;
}

/* Link Styles */
.ProseMirror a,
.tiptap a,
a {
  color: #3b82f6;
  text-decoration: underline;
  text-decoration-color: #93c5fd;
  text-underline-offset: 0.125rem;
  transition: all 0.2s ease;
}

.ProseMirror a:hover,
.tiptap a:hover,
a:hover {
  color: #1d4ed8;
  text-decoration-color: #60a5fa;
}

.ProseMirror a:visited,
.tiptap a:visited,
a:visited {
  color: #7c3aed;
}




.ProseMirror td:last-child,
.tiptap td:last-child,
td:last-child {
  border-right: none;
}

.ProseMirror tr:last-child td,
.tiptap tr:last-child td,
tr:last-child td {
  border-bottom: none;
}

.ProseMirror tr:nth-child(even) td,
.tiptap tr:nth-child(even) td,
tr:nth-child(even) td {
  background-color: #f9fafb;
}

/* Span Styles with Inline Colors */
.ProseMirror span,
.tiptap span,
span {
  /* Inherits color from style attribute or parent */
}



.ProseMirror:focus,
.tiptap:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.ProseMirror::selection,
.tiptap::selection,
.ProseMirror *::selection,
.tiptap *::selection {
  background-color: #3b82f6;
  color: white;
}

/* Print-specific styles */
@media print {
  .ProseMirror,
  .tiptap {
    background: white !important;
    color: black !important;
    font-size: 12pt;
    line-height: 1.5;
  }
  
  .ProseMirror h1,
  .tiptap h1,
  h1 {
    font-size: 18pt;
  }
  
  .ProseMirror h2,
  .tiptap h2,
  h2 {
    font-size: 16pt;
  }
  
  .ProseMirror h3,
  .tiptap h3,
  h3 {
    font-size: 14pt;
  }
  
  .ProseMirror pre,
  .tiptap pre,
  pre {
    background: #f5f5f5 !important;
    color: black !important;
    border: 1px solid #ccc !important;
  }
  
  .ProseMirror blockquote,
  .tiptap blockquote,
  blockquote {
    background: #f9f9f9 !important;
    color: black !important;
    border-left: 4px solid #333 !important;
  }
}
  `;

    const fullHTML = `<style>${tiptapCSS}</style><div class="ProseMirror">${html}</div>`;

    return { html, css: tiptapCSS, fullHTML };
  };

  const handleSave = () => {
    const json = editor.getJSON();
    const text = editor.getText().replace(/\n\n/g, "\n");
    navigator.clipboard.writeText(text);
    const { html, css, fullHTML } = getHTMLWithCSS();
    const markdown = editor.storage.markdown.getMarkdown();
    console.log("Markdown file is: ", markdown);
    if (type !== null && type === "external") {
      setExternalInformationForTipTap((prev) => ({
        ...prev,
        markdown: markdown,
        html: fullHTML,
        plainText: text,
      }));
      setEditExternalResource(false);
    }
    if(type !== null && type ==="internal"){
      setShowInternalResourceAnswerInTipTap((prev)=>({...prev, markdownAnswer: markdown}));
      setIsEditInternalAnswer(false)
    }
    editor.commands.clearContent();
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
        <button
          onClick={handleSave}
          disabled={editor.getText().length === 0}
          className={`flex  gap-x-1  ease-in-out duration-300 transition-all px-6  py-2 items-center rounded-md  ${
            editor.getText().length === 0
              ? "bg-blue-400"
              : "hover:bg-blue-600 bg-blue-500 hover:cursor-pointer hover:shadow-lg"
          } text-white`}
        >
          {" "}
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
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
      return "Add your answer here...";
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

export default function TipTap({ answers = "", type = null }) {
  console.log("My markdown answer", answers)
  return (
    <div className={`editor-container scroll-container`}>
      <EditorProvider
        slotBefore={<MenuBar type={type} />}
        extensions={extensions}
        content={answers}
        key={`${Date.now()}`}
      />
    </div>
  );
}
