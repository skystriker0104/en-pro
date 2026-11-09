import { DictionaryEntry, CategoryOption } from '../types';

// Data starts completely empty as requested by user
export const INITIAL_ENTRIES: DictionaryEntry[] = [];

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Tất cả', icon: 'Layers', color: 'slate' },
  { id: 'vocabulary', label: 'Từ vựng (Vocabulary)', icon: 'BookOpen', color: 'blue' },
  { id: 'grammar', label: 'Ngữ pháp (Grammar)', icon: 'Sparkles', color: 'indigo' },
  { id: 'structure', label: 'Phrasal Verbs & Cấu trúc', icon: 'GitMerge', color: 'amber' },
  { id: 'noun_phrase', label: 'Cụm danh từ (Noun Phrases)', icon: 'Briefcase', color: 'emerald' },
  { id: 'idiom', label: 'Thành ngữ (Idioms & Business)', icon: 'Lightbulb', color: 'purple' }
];

export const TOEIC_PARTS: string[] = [
  'Tất cả các phần',
  'Part 1: Photographs',
  'Part 2: Question - Response',
  'Part 3: Conversations',
  'Part 4: Short Talks',
  'Part 5: Incomplete Sentences',
  'Part 6: Text Completion',
  'Part 7: Reading Comprehension'
];

export const TOEIC_TOPICS: string[] = [
  'Tất cả chủ đề',
  'Contracts & Business',
  'Office & Finance',
  'Customer Service & Hospitality',
  'Regulations & Policy',
  'Grammar Core',
  'Subject-Verb Agreement',
  'Marketing & Customer Care',
  'Manufacturing & Safety',
  'Project Management',
  'Workplace Communication'
];

export const TOEIC_BANDS: string[] = ['Tất cả mục tiêu', '500+', '650+', '750+', '800+'];
