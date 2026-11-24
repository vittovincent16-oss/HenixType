import React from 'react';

export default function DifficultySelector({ currentDifficulty, setDifficulty, isDisabled }) {
  const difficulties = ['Easy', 'Normal', 'Hard', 'Extreme', 'Ultra Extreme', 'Insane'];

  return (
    <div className="selector-group">
      {difficulties.map((level) => (
        <button
          key={level}
          className={`selector-btn ${currentDifficulty === level ? 'active' : ''}`}
          onClick={() => setDifficulty(level)}
          disabled={isDisabled}
        >
          {level}
        </button>
      ))}
    </div>
  );
}