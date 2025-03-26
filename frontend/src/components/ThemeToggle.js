import React from 'react';

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div style={{ padding: '10px', textAlign: 'right' }}>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
}

export default ThemeToggle;
