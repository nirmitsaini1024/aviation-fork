import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import "../styles/tiptap-editor.css";

const extensions = [
  Markdown,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "readonly-bullet-list",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "readonly-ordered-list",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "readonly-list-item",
      },
    },
    heading: {
      HTMLAttributes: {
        class: "readonly-heading",
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: "readonly-paragraph",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "readonly-code-block",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "readonly-blockquote",
      },
    },
  }),
];

export default function ReadOnlyEditor({ externalAnswers = "", type = null }) {
  const getWordCount = (str) => str.trim().split(/\s+/).length;

  return (
    <div
      className={` ${
        type === "internal"
          ? getWordCount(externalAnswers) > 100
            ? "max-h-[400px]"
            : "max-h-[200px] overflow-y-auto"
          : ""
      } scroll-container pt-4`}
      style={{ cursor: "default" }}
    >
      <EditorProvider
        extensions={extensions}
        content={externalAnswers}
        editable={false}
        key={`${Date.now()}`}
      />
    </div>
  );
}
