import React from 'react';

export default function Stats({ wpm, accuracy, errors }) {
  return (
    <div className="live-stats-bar">
      <div className="stat-item">
        <span className="stat-label">WPM</span>
        <span className="stat-value">{wpm}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">ACCURACY</span>
        <span className="stat-value">{accuracy}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">ERRORS</span>
        <span className="stat-value">{errors}</span>
      </div>
    </div>
  );
}