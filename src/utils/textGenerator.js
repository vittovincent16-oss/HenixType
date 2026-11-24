import typingTexts from '../data/typingTexts';

export const generateText = (difficulty, duration = 60) => {
  let key = difficulty === 'Ultra Extreme' ? 'ultraExtreme' : difficulty.toLowerCase();
  const pool = typingTexts[key] || typingTexts.normal;

  const targetCharacterLength = Math.max(300, (duration / 60) * 800);

  let generatedString = "";
  let lastUsedSentence = "";

  while (generatedString.length < targetCharacterLength) {
    let randomIndex = Math.floor(Math.random() * pool.length);
    let selectedSentence = pool[randomIndex];

    if (selectedSentence !== lastUsedSentence) {
      if (generatedString.length > 0) {
        generatedString += " ";
      }
      generatedString += selectedSentence;
      lastUsedSentence = selectedSentence;
    }
  }

  return generatedString;
};