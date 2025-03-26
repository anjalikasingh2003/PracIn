import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/InterviewPage';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  // Protected Route wrapper
  const PrivateRoute = ({ element }) =>
    isAuthenticated ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard onLogout={handleLogout} />}
              />
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute
                element={
                  <InterviewPage
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    showTimer={showTimer}
                    toggleTimer={() => setShowTimer((prev) => !prev)}
                    onLogout={handleLogout}
                  />
                }
              />
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
