export type CategoryType = 'all' | 'vocabulary' | 'grammar' | 'structure' | 'noun_phrase' | 'idiom';

export type StatusFilterType = 'all' | 'favorite' | 'learning' | 'mastered';

export type SortByType = 'newest' | 'oldest' | 'az' | 'za' | 'reviews';

export interface WordFamilyItem {
  pos: 'n' | 'v' | 'adj' | 'adv' | string;
  word: string;
  meaning?: string;
}

export interface ExampleItem {
  en: string;
  vi?: string;
}

export interface WordMeaning {
  id?: string;
  partOfSpeech: string;
  pattern?: string; // Mẫu cấu trúc cụ thể (ví dụ: "take on sb", "take on st", "look up to sb")
  meaningVi: string;
  meaningEn?: string;
  exampleEn?: string; // Ví dụ riêng cho mẫu này
  exampleVi?: string; // Dịch nghĩa ví dụ
}

export interface DictionaryEntry {
  id: string;
  category: CategoryType;
  title: string;
  phonetic?: string;
  partOfSpeech?: string;
  meaningVi: string;
  meaningEn?: string;
  meanings?: WordMeaning[]; // Support for multiple meanings & multiple parts of speech
  toeicPart?: string;
  topic?: string;
  band?: string;
  formula?: string;
  components?: string;
  businessContext?: string;
  toeicTip?: string;
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  wordFamily?: WordFamilyItem[];
  examples?: ExampleItem[];
  favorite?: boolean;
  mastered?: boolean;
  reviewCount?: number;
  lastReviewed?: string;
  updatedAt?: string;
}

export interface CategoryOption {
  id: CategoryType;
  label: string;
  icon: string;
  color: string;
  desc?: string;
}
