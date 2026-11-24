import React, { useEffect, useState } from 'react';
import DifficultySelector from '../components/DifficultySelector';
import DurationSelector from '../components/DurationSelector';
import TypingTest from '../components/TypingTest';
import '../styles/typing.css';

function SideWaves() {
  return (
    <>
      {['left', 'right'].map((side) => (
        <div key={side} className={`tp-side-rail tp-side-rail--${side}`} aria-hidden="true">
          <svg className="tp-rail-contours" viewBox="0 0 160 900" preserveAspectRatio="none">
            <path className="tp-contour" d="M24 0 Q56 112 24 225 T24 450 T24 675 T24 900" />
            <path className="tp-contour tp-contour--2" d="M64 0 Q96 112 64 225 T64 450 T64 675 T64 900" />
            <path className="tp-contour tp-contour--3" d="M104 0 Q136 112 104 225 T104 450 T104 675 T104 900" />
          </svg>
          {[1, 2, 3, 4, 5].map((n) => (
            <svg key={n} className={`tp-mini-wave tp-mini-wave--${n}`} viewBox="0 0 26 12">
              <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
            </svg>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Home({ settings, onBack }) {
  const [difficulty, setDifficulty] = useState('Normal');
  const [duration, setDuration] = useState(30);
  const [testStatus, setTestStatus] = useState('READY');
  const typing = testStatus === 'TYPING';

  // Lets typing.css paint the whole screen black while this page is open.
  useEffect(() => {
    document.documentElement.classList.add('tp-on');
    return () => document.documentElement.classList.remove('tp-on');
  }, []);

  return (
    <div className={`home-page${typing ? ' is-typing' : ''}`}>
      <SideWaves />

      <header className="home-head">
        <div>
          <h1 className="home-title">Typing test</h1>
          <p className="home-sub">Choose a difficulty and a duration, then start typing.</p>
        </div>
        {onBack && (
          <button type="button" className="home-back" onClick={onBack}>
            <strong>&lt;-Back to Page</strong>
          </button>
        )}
      </header>

      <div className="controls-header">
        <DifficultySelector
          currentDifficulty={difficulty}
          setDifficulty={setDifficulty}
          isDisabled={typing}
        />
        <DurationSelector
          currentDuration={duration}
          setDuration={setDuration}
          isDisabled={typing}
        />
      </div>

      <div className="test-stage">
        <TypingTest
          difficulty={difficulty}
          duration={duration}
          testStatus={testStatus}
          setTestStatus={setTestStatus}
          settings={settings}
        />
      </div>
    </div>
  );
}