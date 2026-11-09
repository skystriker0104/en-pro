// Pronunciation utility using browser's SpeechSynthesis API

export const speak = (text: string, lang: string = 'en-US', rate: number = 0.9): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate; // slightly slower for clearer TOEIC listening practice
  utterance.pitch = 1.0;

  // Try to find a good native English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => 
    v.lang.startsWith(lang.slice(0, 2)) && 
    (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
  );
  
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
};
