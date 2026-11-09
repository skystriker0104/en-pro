import React from 'react';
import {
  Plus,
  Layers,
  Download,
  Moon,
  Sun,
  Sparkles,
  Disc
} from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
  onOpenFlashcard: () => void;
  onOpenQuiz: () => void;
  onOpenBackup: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  totalCount: number;
  masteredCount: number;
  storageSource: 'local_file' | 'local_storage';
  isSaving: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAddNew,
  onOpenFlashcard,
  onOpenQuiz,
  onOpenBackup,
  darkMode,
  setDarkMode,
  isSaving
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#faf7f2] dark:bg-[#18181b] border-b-2 border-stone-900 dark:border-stone-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand - Vinyl & Sweetaesthetic */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#d85c38] text-white flex items-center justify-center font-bold border-2 border-stone-900 shadow-solid-sm">
              <Disc className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                SweetTOEIC
              </span>

            </div>
          </div>

          {/* Solid Flat Action Buttons */}
          <div className="flex items-center gap-2">

            <button
              onClick={onOpenFlashcard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 rounded-lg shadow-solid-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcard</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 rounded-lg shadow-solid-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luyện tập</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="p-1.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 rounded-lg shadow-solid-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Sao lưu JSON / CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 rounded-lg shadow-solid-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Chuyển chế độ sáng/tối"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onAddNew}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold bg-[#d85c38] hover:bg-[#b94826] text-white border-2 border-stone-900 rounded-lg shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
