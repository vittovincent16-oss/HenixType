import React, { useEffect, useState } from 'react';
import { getResults } from '../utils/storage';
import '../styles/dashboard.css';

const WAVE = `M0 45 q50 -40 100 0${' t100 0'.repeat(7)}`;

// Counts up from 0 so the numbers move when the page opens.
function useCount(target, ms = 1000) {
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

function Wave() {
  return (
    <div className="dash-wave" aria-hidden="true">
      <svg viewBox="0 0 800 90" preserveAspectRatio="none"><path d={WAVE} /></svg>
      <svg viewBox="0 0 800 90" preserveAspectRatio="none"><path d={WAVE} /></svg>
      <svg viewBox="0 0 800 90" preserveAspectRatio="none"><path d={WAVE} /></svg>
    </div>
  );
}

// Left & right side wave rails filling the blank outer margins
function SideWaves() {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div key={side} className={`db-side-rail db-side-rail--${side}`} aria-hidden="true">
          <svg className="db-rail-contours" viewBox="0 0 160 900" preserveAspectRatio="none">
            <path className="db-contour" d="M24 0 Q56 112 24 225 T24 450 T24 675 T24 900" />
            <path className="db-contour db-contour--2" d="M64 0 Q96 112 64 225 T64 450 T64 675 T64 900" />
            <path className="db-contour db-contour--3" d="M104 0 Q136 112 104 225 T104 450 T104 675 T104 900" />
          </svg>
          {[1, 2, 3, 4, 5].map((n) => (
            <svg key={n} className={`db-mini-wave db-mini-wave--${n}`} viewBox="0 0 26 12">
              <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
            </svg>
          ))}
        </div>
      ))}
    </>
  );
}

// WPM over time, drawn as a smooth wave.
function Trend({ values }) {
  if (values.length < 2) {
    return (
      <div className="dash-idle">
        <Wave />
        <p>Finish two tests to see your progress here.</p>
      </div>
    );
  }
  const W = 600;
  const H = 160;
  const min = Math.min(...values);
  const span = Math.max(1, Math.max(...values) - min);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - 12 - ((v - min) / span) * (H - 24)]);
  const line = pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const mx = (pts[i - 1][0] + x) / 2;
    return `${d} C${mx} ${pts[i - 1][1]} ${mx} ${y} ${x} ${y}`;
  }, '');
  const [lastX, lastY] = pts[pts.length - 1];

  return (
    <svg className="dash-trend" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`WPM over your last ${values.length} tests`}>
      <defs>
        <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="url(#dash-fill)" />
      <path className="dash-line" d={line} />
      <circle className="dash-dot-pulse" cx={lastX} cy={lastY} r="4" />
    </svg>
  );
}

export default function Dashboard({ onStart }) {
  const [results] = useState(getResults);

  // Paints the whole viewport pitch-black to match Home.jsx
  useEffect(() => {
    document.documentElement.classList.add('db-on');
    return () => document.documentElement.classList.remove('db-on');
  }, []);

  const totalTests = results.length;
  const bestWpm = totalTests > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / totalTests) : 0;
  const avgAcc = totalTests > 0 ? results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests : 0;
  const totalMinutes = Math.floor(results.reduce((acc, r) => acc + r.duration, 0) / 60);

  const byDate = [...results].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const trend = byDate.slice(-12).map((r) => r.wpm);
  const recentTests = byDate.slice(-5).reverse();

  const best = useCount(bestWpm);
  const avg = useCount(avgWpm);
  const acc = useCount(avgAcc);
  const tests = useCount(totalTests);
  const mins = useCount(totalMinutes);

  const cards = [
    ['Average WPM', Math.round(avg)],
    ['Average accuracy', `${acc.toFixed(1)}%`],
    ['Total tests', Math.round(tests)],
    ['Typing time', `${Math.round(mins)}m`],
  ];

  return (
    <div className="dashboard-page">
      <SideWaves />

      <header className="page-head">
        <div>
          <h2>Dashboard</h2>
          <p className="page-sub">Your typing progress at a glance.</p>
        </div>
        {onStart && (
          <button type="button" className="dash-cta" onClick={onStart}>
            Start a test
          </button>
        )}
      </header>

      <section className="dash-grid" aria-label="Your stats">
        <div className="dash-hero">
          <span className="card-label">Best WPM</span>
          <span className="dash-big">{Math.round(best)}</span>
          <span className="dash-note">
            {totalTests ? 'Your fastest result so far.' : 'Finish a test to set your first record.'}
          </span>
          <Wave />
        </div>
        {cards.map(([label, value], i) => (
          <div className="stat-card" key={label} style={{ '--i': i }}>
            <span className="card-label">{label}</span>
            <span className="card-value">{value}</span>
          </div>
        ))}
      </section>

      <section className="dash-panel">
        <h3>Progress</h3>
        <p className="page-sub">{trend.length > 1 ? `WPM over your last ${trend.length} tests` : 'Your WPM over time'}</p>
        <Trend values={trend} />
      </section>

      <section className="recent-history">
        <h3>Recent tests</h3>
        {recentTests.length === 0 ? (
          <div className="empty-state">
            <p>No tests completed yet. Start typing!</p>
            {onStart && (
              <button type="button" className="dash-cta" onClick={onStart}>
                Start a test
              </button>
            )}
          </div>
        ) : (
          <div className="history-list">
            {recentTests.map((test, i) => (
              <div key={test.id} className="history-item" style={{ '--i': i }}>
                <div className="hist-primary">
                  <span className="hist-wpm">{test.wpm} WPM</span>
                  <span className="hist-acc">{test.accuracy}%</span>
                </div>
                <div className="hist-secondary">
                  <span>{test.difficulty}</span>
                  <span>{test.duration}s</span>
                  <span>{new Date(test.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}