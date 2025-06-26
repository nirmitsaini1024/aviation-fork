import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import "../styles/tiptap-editor.css";
import { ReviewManagementContext } from "../Context/ReviewManagementProvider";
import { useContext } from "react";
import { Pencil } from "lucide-react";


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

export default function ReadOnlyEditor({
  content = "",
}) {
  const { setEditChapter } = useContext(
      ReviewManagementContext
    );

  return (
    <div className={`editor-container scroll-container pt-4`} style={{"cursor": "default"}}>
        <EditorProvider
          extensions={extensions}
          content={content}
          editable={false}
        />

         <button
          onClick={(e) => {
            e.stopPropagation();
            setEditChapter(true);
          }}
          className="absolute z-50 top-4 right-4 p-2 hover:text-blue-700 text-blue-500"
        >
          <Pencil size={16} />
        </button>
    </div>
  );
}