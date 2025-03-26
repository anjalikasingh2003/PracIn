// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import '../styles/auth.css'; // Reuse same theme
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ onLogout }) => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching past interview data
    const mockHistory = [
      { date: '2025-03-25', score: '85%' },
      { date: '2025-03-18', score: '72%' },
    ];
    setInterviews(mockHistory);
  }, []);

  const handleStartInterview = () => {
    navigate('/interview'); // We'll create this route next
  };

  return (
    <div className="auth-page">
      <h1 className="gradient-title">PracIn</h1>
      <div className="auth-container">
        <button onClick={handleStartInterview}>🎤 Take Interview</button>

        <h3>📜 Interview History</h3>
        <ul style={{ textAlign: 'left' }}>
          {interviews.length === 0 ? (
            <p>No interviews taken yet.</p>
          ) : (
            interviews.map((item, index) => (
              <li key={index}>
                <strong>{item.date}</strong> — Score: {item.score}
              </li>
            ))
          )}
        </ul>

        <button onClick={onLogout} style={{ marginTop: '20px', backgroundColor: '#ff4d4d' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
