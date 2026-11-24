import React, { useEffect, useState } from 'react';
import '../styles/results.css';

const WAVE = `M0 32 q40 -26 80 0${' t80 0'.repeat(9)}`;

function useCount(target, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const num = Number(target) || 0;
    const calm =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion');
    if (calm) {
      setV(num);
      return undefined;
    }
    let raf;
    let t0;
    const step = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min(1, (t - t0) / ms);
      setV(num * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function HeroWave() {
  return (
    <div className="rs-hero-wave" aria-hidden="true">
      <svg viewBox="0 0 800 64" preserveAspectRatio="none">
        <path d={WAVE} />
      </svg>
      <svg viewBox="0 0 800 64" preserveAspectRatio="none">
        <path d={WAVE} />
      </svg>
    </div>
  );
}

export default function ResultScreen({ stats, onRetry, onHome }) {
  const animWpm = useCount(stats.wpm);
  const animAcc = useCount(stats.accuracy);

  const detailCards = [
    { label: 'Correct Chars', value: stats.correctChars, tone: 'correct' },
    { label: 'Incorrect Chars', value: stats.incorrectChars, tone: 'incorrect' },
    { label: 'Total Chars', value: stats.totalChars, tone: '' },
    { label: 'Errors', value: stats.errors, tone: 'errors' },
  ];

  return (
    <div className="result-screen">
      <header className="rs-head">
        <div>
          <h2 className="result-title">TEST COMPLETE</h2>
          <p className="rs-sub">Session summary and keystroke breakdown.</p>
        </div>
        <div className="rs-mode-badges">
          <span className="rs-badge">{stats.difficulty}</span>
          <span className="rs-badge">{stats.duration}s</span>
        </div>
      </header>

      <div className="result-primary">
        <div className="result-main-stat" style={{ '--i': 0 }}>
          <span className="label">WPM</span>
          <span className="value">{Math.round(animWpm)}</span>
          <HeroWave />
        </div>

        <div className="result-main-stat" style={{ '--i': 1 }}>
          <span className="label">ACCURACY</span>
          <span className="value">{Math.round(animAcc)}%</span>
          <HeroWave />
        </div>
      </div>

      <div className="result-details">
        {detailCards.map((item, i) => (
          <div className="detail-card" key={item.label} style={{ '--i': i }}>
            <span className="detail-label">{item.label}</span>
            <span className={`detail-val${item.tone ? ` ${item.tone}` : ''}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          TRY AGAIN
        </button>
        <button type="button" className="btn btn-secondary" onClick={onHome}>
          HOME
        </button>
      </div>
    </div>
  );
}