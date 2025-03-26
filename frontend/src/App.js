import React, { useState, useEffect } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import ChatBot from './components/ChatBot';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false); // For demo, false by default
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

  useEffect(() => {
    // Check if user is already authenticated (via localStorage, token, etc.)
    const token = localStorage.getItem('authToken'); // Example using localStorage
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to handle login and update auth state
  const handleLogin = (token) => {
    localStorage.setItem('authToken', token); // Store token in localStorage (or session)
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token on logout
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        {/* Conditionally render login page or main app */}
        {isAuthenticated ? (
          <>
            {/* Navbar and other components */}
            <Navbar
              showTimer={showTimer}
              toggleTimer={() => setShowTimer((prev) => !prev)}
              isInterviewStarted={interviewStarted}
              onLogout={handleLogout}
            />
            {/* Theme toggle */}
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            {/* Main content: Editor + Chat */}
            <div className="main-content">
              <CodeEditor darkMode={darkMode} />
              <ChatBot darkMode={darkMode} />
            </div>
          </>
        ) : (
          // If not authenticated, show login or register page
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login by default */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
