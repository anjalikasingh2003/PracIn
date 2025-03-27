import React from 'react';
import '../styles/ThemeToggle.css'; // We'll create this CSS file

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle-button ${darkMode ? 'dark' : 'light'}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        <span className="icon">{darkMode ? '🌞' : '🌙'}</span>
        <span className="text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </div>
  );
}

export default ThemeToggle;

