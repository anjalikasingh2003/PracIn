import React from 'react';
import { Editor } from '@monaco-editor/react';

function CodeEditor({ code, setCode, darkMode }) {
  return (
    <div className="editor-container">
      <Editor
        height="90vh"
        language="cpp"
        value={code}
        theme={darkMode ? 'vs-dark' : 'light'}
        onChange={(value) => setCode(value)} // Update parent with new code
      />
    </div>
  );
}

export default CodeEditor;
