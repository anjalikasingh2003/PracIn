import React, { useEffect, useState } from 'react';
import '../styles/navbar.css';

const Navbar = ({ showTimer, toggleTimer, isInterviewStarted }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isInterviewStarted && showTimer) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, showTimer]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="navbar">
      <h1 className="gradient-text">💻 PracIn</h1>
      <div className="nav-buttons">
        <button className="nav-button" onClick={() => window.location.reload()}>New Interview</button>
        <button className="nav-button" onClick={toggleTimer}>
          {showTimer ? 'Hide Timer' : 'Show Timer'}
        </button>
        {showTimer && <span className="timer">{formatTime(seconds)}</span>}
      </div>
    </div>
  );
};

export default Navbar;
