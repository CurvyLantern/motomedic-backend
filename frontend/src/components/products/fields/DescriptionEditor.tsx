import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// type DescriptionEditorType = {
//   label: string;
//   placeholder: string;
// };
export const DescriptionEditor = ({
  content,
  setContent,
  defaultContent,
}: {
  defaultContent: string;
  setContent: (v: string) => void;
  content?: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Underline,
      // Link,
      // Superscript,
      // SubScript,
      // Highlight,
      // TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: defaultContent,
    // onUpdate: ({ editor, transaction }) => {
    //   setContent(editor.getHTML());
    // },
    onBlur: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <RichTextEditor sx={{ height: "100%" }} editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
