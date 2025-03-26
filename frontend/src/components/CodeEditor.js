import React from 'react';
import { Editor } from '@monaco-editor/react';

function CodeEditor({ darkMode }) {
  return (
    <div className="editor-container">
      <Editor
        height="90vh"
        defaultLanguage="cpp"
        defaultValue="// Write your code here..."
        theme={darkMode ? 'vs-dark' : 'light'}
      />
    </div>
  );
}

export default CodeEditor;
