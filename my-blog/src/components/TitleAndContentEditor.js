import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

const TitleAndContentEditor = ({ initialTitle = '', initialContent = '', onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTitle); // State for editor content
  const [content, setContent] = useState(initialContent); // State for editor content

  const handleSave = () => {
    if (onSave) {
      onSave(title, content); // Pass the content to the parent component
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(content); // Pass the content to the parent component
    }
  };

  return (
    <div>
      {/* Editable Title */}
      <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              display: "block",
              width: "100%",
            }}
          />
      {/* Editable Content */}
      <ReactQuill 
        value={content} 
        onChange={setContent} 
        theme="snow" // Theme: 'snow' or 'bubble'
      />
      {/* Buttons */}
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default TitleAndContentEditor;