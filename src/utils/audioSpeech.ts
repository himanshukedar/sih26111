import { Platform } from 'react-native';
import { Language } from '../types';

let isCurrentlySpeaking = false;
let currentUtterance: any = null;

const LANG_VOICE_MAP: Record<Language, string[]> = {
  hi: ['hi-IN', 'hi', 'en-IN'],
  mr: ['mr-IN', 'hi-IN', 'mr', 'en-IN'],
  ta: ['ta-IN', 'ta', 'en-IN'],
  te: ['te-IN', 'te', 'en-IN'],
  en: ['en-IN', 'en-US', 'en-GB', 'en']
};

export function speakVernacularAdvisory(
  text: string,
  lang: Language,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtterance = utterance;

      const targetLocales = LANG_VOICE_MAP[lang] || ['en-US'];
      utterance.lang = targetLocales[0];
      utterance.rate = 0.95; // Slightly slower for clear rural understanding
      utterance.pitch = 1.0;

      // Find best available voice
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => 
        targetLocales.some(loc => v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        isCurrentlySpeaking = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        isCurrentlySpeaking = false;
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        isCurrentlySpeaking = false;
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
      return false;
    }
  }

  // If native without native TTS module, fallback gracefully
  if (onStart) onStart();
  setTimeout(() => {
    if (onEnd) onEnd();
  }, 2500);
  return false;
}

export function stopSpeech(): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isCurrentlySpeaking = false;
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return isCurrentlySpeaking;
}
