export const calculateWPM = (correctChars, elapsedSeconds) => {
  if (elapsedSeconds <= 0 || correctChars === 0) return 0;
  
  const elapsedMinutes = elapsedSeconds / 60;
  const wpm = (correctChars / 5) / elapsedMinutes;
  
  return Math.max(0, Math.round(wpm));
};

export const calculateAccuracy = (correctChars, totalTyped) => {
  if (totalTyped <= 0) return 100;
  
  const accuracy = (correctChars / totalTyped) * 100;

  return Number(accuracy.toFixed(1));
};