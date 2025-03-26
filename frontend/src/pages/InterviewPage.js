import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ChatBot from '../components/ChatBot';
import ThemeToggle from '../components/ThemeToggle';
import Navbar from '../components/Navbar';
import axios from 'axios';
import '../styles/interview.css';
import CameraFeed from '../components/CameraFeed'; 


const InterviewPage = ({ darkMode, setDarkMode, showTimer, toggleTimer, onLogout }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:5000/run', {
        code: code,
        language: 'cpp', // or 'python', make it dynamic later
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || 'Error executing code');
    }
  };

  return (
    <>
      <Navbar showTimer={showTimer} toggleTimer={toggleTimer} isInterviewStarted={true} onLogout={onLogout} />
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="main-content">
        <div className="editor-container">
          <CodeEditor code={code} setCode={setCode} darkMode={darkMode} />
          <button onClick={runCode} className="run-button">Run Code</button>
          <div className="output-box">
            <pre>{output}</pre>
          </div>
        </div>
        <ChatBot darkMode={darkMode} />
        <CameraFeed />
      </div>
    </>
  );
};

export default InterviewPage;
