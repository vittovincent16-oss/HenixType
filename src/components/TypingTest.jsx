import React, { useState, useEffect, useRef } from 'react';
import { generateText } from '../utils/textGenerator';
import { calculateWPM, calculateAccuracy } from '../utils/typingMetrics';
import { saveResult } from '../utils/storage';
import Timer from './Timer';
import Stats from './Stats';
import ResultScreen from './ResultScreen';

export default function TypingTest({ difficulty, duration, testStatus, setTestStatus, settings }) {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  
  const [cumulativeStats, setCumulativeStats] = useState({ totalTyped: 0, errors: 0 });
  const [finalStats, setFinalStats] = useState(null);
  
  const inputRef = useRef(null);
  const userInputRef = useRef(userInput);
  const cumulativeStatsRef = useRef(cumulativeStats);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    userInputRef.current = userInput;
    cumulativeStatsRef.current = cumulativeStats;
  }, [userInput, cumulativeStats]);

  const initTest = () => {
    setText(generateText(difficulty, duration));
    setUserInput("");
    setTimeLeft(duration);
    setCumulativeStats({ totalTyped: 0, errors: 0 });
    setFinalStats(null);
    setTestStatus('READY');
    hasSavedRef.current = false;

    if (settings?.autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (testStatus !== 'TYPING' && testStatus !== 'FINISHED') {
      initTest();
    }
  }, [difficulty, duration]);

  const finishTest = (overrideInput, overrideCumul) => {
    setTestStatus('FINISHED');
    
    const finalInput = overrideInput !== undefined ? overrideInput : userInputRef.current;
    const finalCumul = overrideCumul !== undefined ? overrideCumul : cumulativeStatsRef.current;
    
    const correct = finalInput.split('').filter((c, i) => c === text[i]).length;
    const incorrect = finalInput.length - correct;
    
    const elapsed = duration - timeLeft;
    const safeElapsed = elapsed === 0 && finalInput.length > 0 ? 1 : elapsed;
    
    const statsToSave = {
      wpm: calculateWPM(correct, safeElapsed),
      accuracy: calculateAccuracy(correct, finalCumul.totalTyped),
      correctChars: correct,
      incorrectChars: incorrect,
      totalTypedChars: finalInput.length,
      errors: finalCumul.errors,
      difficulty: difficulty,
      duration: duration
    };

    if (!hasSavedRef.current) {
      saveResult(statsToSave);
      hasSavedRef.current = true;
    }
    
    setFinalStats(statsToSave);
  };

  useEffect(() => {
    let interval;
    if (testStatus === 'TYPING' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && testStatus === 'TYPING') {
      finishTest();
    }
    return () => clearInterval(interval);

  }, [testStatus, timeLeft]);

  const focusInput = () => {
    if (settings?.autoFocus && inputRef.current && testStatus !== 'FINISHED') {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    if (testStatus === 'FINISHED') return;
    if (testStatus === 'READY') setTestStatus('TYPING');

    const value = e.target.value;
    
    if (value.length <= text.length) {
      let newCumulStats = cumulativeStats;

      if (value.length > userInput.length) {
        const addedChar = value[value.length - 1];
        const targetChar = text[value.length - 1];
        const isError = addedChar !== targetChar;

        newCumulStats = {
          totalTyped: cumulativeStats.totalTyped + 1,
          errors: cumulativeStats.errors + (isError ? 1 : 0)
        };
        setCumulativeStats(newCumulStats);
      }
      
      setUserInput(value);

      if (value.length === text.length && text.length > 0) {
        finishTest(value, newCumulStats);
      }
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let stateClass = 'untyped';
      if (index < userInput.length) {
        stateClass = char === userInput[index] ? 'correct' : 'incorrect';
      }
      
      const isCurrent = index === userInput.length;

      const caretClass = (isCurrent && testStatus !== 'FINISHED') 
        ? (settings?.showCaret ? 'current' : 'current-no-caret') 
        : '';

      return (
        <span key={index} className={`char ${stateClass} ${caretClass}`}>
          {char}
        </span>
      );
    });
  };

  const liveCorrect = userInput.split('').filter((c, i) => c === text[i]).length;
  const liveElapsed = testStatus === 'TYPING' ? (duration - timeLeft) : 0;
  const safeLiveElapsed = liveElapsed === 0 && userInput.length > 0 ? 1 : liveElapsed;
  
  const liveWPM = testStatus === 'READY' ? 0 : calculateWPM(liveCorrect, safeLiveElapsed);
  const liveAccuracy = calculateAccuracy(liveCorrect, cumulativeStats.totalTyped);

  if (testStatus === 'FINISHED' && finalStats) {
    return <ResultScreen stats={finalStats} onRetry={initTest} onHome={initTest} />;
  }

  return (
    <div className="typing-test-container" onClick={focusInput}>
      <div className="test-header">
        <Timer timeLeft={timeLeft} />
        <Stats wpm={liveWPM} accuracy={liveAccuracy} errors={cumulativeStats.errors} />
      </div>
      
      <div className="typing-area">
        {renderText()}
      </div>

      <input
        type="text"
        ref={inputRef}
        className="hidden-input"
        value={userInput}
        onChange={handleInputChange}
        autoFocus={settings?.autoFocus}
      />

      <button className="restart-btn" onClick={initTest}>
        Restart ↻
      </button>
    </div>
  );
}