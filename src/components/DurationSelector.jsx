import React from 'react';

export default function DurationSelector({ currentDuration, setDuration, isDisabled }) {
  const durations = [15, 30, 60, 120];

  return (
    <div className="selector-group">
      {durations.map((time) => (
        <button
          key={time}
          className={`selector-btn ${currentDuration === time ? 'active' : ''}`}
          onClick={() => setDuration(time)}
          disabled={isDisabled}
        >
          {time}s
        </button>
      ))}
    </div>
  );
}