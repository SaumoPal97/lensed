import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

function RichTextEditor({ value, setValue, readOnly = false }) {
  const modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "code-block"],
        ["clean"],
      ],
    },
    formats = [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
      "image",
      "code-block",
    ];

  return (
    <ReactQuill
      theme={readOnly ? "bubble" : "snow"}
      modules={modules}
      formats={formats}
      value={value}
      onChange={setValue}
      readOnly={readOnly}
    />
  );
}

export default RichTextEditor;
