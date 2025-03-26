import React, { useState } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import ChatBot from './components/ChatBot';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(true); // Set this when the interview/chat starts

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Navbar goes at the top */}
      <Navbar
        showTimer={showTimer}
        toggleTimer={() => setShowTimer((prev) => !prev)}
        isInterviewStarted={interviewStarted}
      />

      {/* Theme toggle */}
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main content: Editor + Chat */}
      <div className="main-content">
        <CodeEditor darkMode={darkMode} />
        <ChatBot  darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
