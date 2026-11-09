import React from 'react';
import { CategoryType, CategoryOption } from '../types';

interface CategoryNavProps {
  categories: CategoryOption[];
  selectedCategory: CategoryType;
  onSelectCategory: (id: CategoryType) => void;
  counts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  counts 
}) => {
  return (
    <div className="overflow-x-auto pb-1 scrollbar-none">
      <div className="flex gap-2 min-w-max">
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const count = counts[cat.id] || 0;

          // Track-inspired labels like album tracks
          const trackNumbers: Record<string, string> = {
            all: 'ALL',
            vocabulary: 'A1',
            grammar: 'A2',
            structure: 'B1',
            noun_phrase: 'B2',
            idiom: 'B3',
          };

          const activeColors: Record<string, string> = {
            all: 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900',
            vocabulary: 'bg-sky-200 text-stone-900 dark:bg-sky-300 dark:text-stone-900',
            grammar: 'bg-rose-200 text-stone-900 dark:bg-rose-300 dark:text-stone-900',
            structure: 'bg-amber-200 text-stone-900 dark:bg-amber-300 dark:text-stone-900',
            noun_phrase: 'bg-emerald-200 text-stone-900 dark:bg-emerald-300 dark:text-stone-900',
            idiom: 'bg-purple-200 text-stone-900 dark:bg-purple-300 dark:text-stone-900',
          };

          const shortLabels: Record<string, string> = {
            all: 'Tất cả',
            vocabulary: 'Từ vựng',
            grammar: 'Ngữ pháp',
            structure: 'Cấu trúc',
            noun_phrase: 'Cụm danh từ',
            idiom: 'Idiom & Cụm từ',
          };

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs border-2 border-stone-900 dark:border-stone-700 transition-all ${
                isSelected 
                  ? `${activeColors[cat.id]} shadow-solid-sm` 
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <span className="font-mono text-[10px] font-black opacity-60">
                {trackNumbers[cat.id]}
              </span>
              <span>{shortLabels[cat.id] || cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isSelected ? 'bg-black/10 dark:bg-white/20' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
