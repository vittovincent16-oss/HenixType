import React, { useState, useEffect } from 'react';
import { getResults, clearResults } from '../utils/storage';
import '../styles/statistics.css';

const EMPTY_WAVE = `M0 28 q40 -22 80 0${' t80 0'.repeat(9)}`;

function useCount(target, ms = 950) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const calm =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion');
    if (calm) {
      setV(target);
      return undefined;
    }
    let raf;
    let t0;
    const step = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function SideWaves() {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div key={side} className={`st-side-rail st-side-rail--${side}`} aria-hidden="true">
          <svg className="st-rail-contours" viewBox="0 0 160 900" preserveAspectRatio="none">
            <path className="st-contour" d="M24 0 Q56 112 24 225 T24 450 T24 675 T24 900" />
            <path className="st-contour st-contour--2" d="M64 0 Q96 112 64 225 T64 450 T64 675 T64 900" />
            <path className="st-contour st-contour--3" d="M104 0 Q136 112 104 225 T104 450 T104 675 T104 900" />
          </svg>
          {[1, 2, 3, 4, 5].map((n) => (
            <svg key={n} className={`st-mini-wave st-mini-wave--${n}`} viewBox="0 0 26 12">
              <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
            </svg>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Statistics() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  // Paints the whole viewport pitch-black to match Home.jsx and Dashboard.jsx
  useEffect(() => {
    document.documentElement.classList.add('st-on');
    return () => document.documentElement.classList.remove('st-on');
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all Henix Type statistics? This cannot be undone.')) {
      if (clearResults()) {
        setResults([]);
      }
    }
  };

  const hasData = results.length > 0;
  const bestWpm = hasData ? Math.max(...results.map((r) => r.wpm)) : 0;
  const lowestWpm = hasData ? Math.min(...results.map((r) => r.wpm)) : 0;
  const bestAcc = hasData ? Math.max(...results.map((r) => r.accuracy)) : 0;
  const totalErrors = results.reduce((acc, r) => acc + r.errors, 0);
  const totalCorrectChars = results.reduce((acc, r) => acc + r.correctChars, 0);
  const totalTypedChars = results.reduce((acc, r) => acc + r.totalTypedChars, 0);

  const animBestWpm = useCount(bestWpm);
  const animLowestWpm = useCount(lowestWpm);
  const animBestAcc = useCount(bestAcc);
  const animErrors = useCount(totalErrors);
  const animCorrect = useCount(totalCorrectChars);
  const animTyped = useCount(totalTypedChars);

  if (!hasData) {
    return (
      <div className="statistics-page st-empty-page">
        <SideWaves />
        <h2>STATISTICS</h2>
        <div className="st-empty-box">
          <p>No data available. Complete a typing test to generate statistics.</p>
          <div className="st-empty-wave" aria-hidden="true">
            <svg viewBox="0 0 800 54" preserveAspectRatio="none">
              <path d={EMPTY_WAVE} />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const difficulties = ['Easy', 'Normal', 'Hard', 'Extreme', 'Ultra Extreme', 'Insane'];
  const diffStats = difficulties
    .map((diff) => {
      const diffResults = results.filter((r) => r.difficulty === diff);
      if (diffResults.length === 0) return null;

      return {
        name: diff,
        tests: diffResults.length,
        bestWpm: Math.max(...diffResults.map((r) => r.wpm)),
        avgWpm: Math.round(diffResults.reduce((acc, r) => acc + r.wpm, 0) / diffResults.length),
        avgAcc: (diffResults.reduce((acc, r) => acc + r.accuracy, 0) / diffResults.length).toFixed(1),
      };
    })
    .filter(Boolean);

  const statCards = [
    { label: 'ALL-TIME BEST WPM', value: Math.round(animBestWpm) },
    { label: 'LOWEST WPM', value: Math.round(animLowestWpm) },
    { label: 'BEST ACCURACY', value: `${Math.round(animBestAcc)}%` },
    { label: 'TOTAL ERRORS', value: Math.round(animErrors), isError: true },
    { label: 'CORRECT CHARS', value: Math.round(animCorrect) },
    { label: 'TOTAL TYPED', value: Math.round(animTyped) },
  ];

  return (
    <div className="statistics-page">
      <SideWaves />

      <div className="st-header">
        <div>
          <h2>DETAILED STATISTICS</h2>
          <p className="st-sub">Full keystroke breakdown across {results.length} completed {results.length === 1 ? 'test' : 'tests'}.</p>
        </div>
        <button type="button" className="st-clear-btn" onClick={handleClear}>
          Clear Data
        </button>
      </div>

      <div className="st-stats-grid">
        {statCards.map((card, i) => (
          <div className="st-stat-card" key={card.label} style={{ '--i': i }}>
            <span className="st-card-label">{card.label}</span>
            <span className={`st-card-value${card.isError ? ' st-error-color' : ''}`}>
              {card.value}
            </span>
          </div>
        ))}
      </div>

      <div className="st-breakdown">
        <div className="st-breakdown-head">
          <h3>PERFORMANCE BY DIFFICULTY</h3>
        </div>
        <div className="st-diff-grid">
          {diffStats.map((stat, i) => (
            <div key={stat.name} className="st-diff-card" style={{ '--i': i }}>
              <h4>{stat.name}</h4>
              <p>Tests: <span>{stat.tests}</span></p>
              <p>Best WPM: <span>{stat.bestWpm}</span></p>
              <p>Avg WPM: <span>{stat.avgWpm}</span></p>
              <p>Avg Acc: <span>{stat.avgAcc}%</span></p>
              <div className="st-diff-bar" aria-hidden="true">
                <div className="st-diff-bar-fill" style={{ width: `${Math.min(100, Number(stat.avgAcc))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}