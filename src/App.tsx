import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import StatsBanner from './components/StatsBanner';
import CategoryNav from './components/CategoryNav';
import SearchBar from './components/SearchBar';
import EntryCard from './components/EntryCard';
import EntryModal from './components/EntryModal';
import FlashcardModal from './components/FlashcardModal';
import QuizModal from './components/QuizModal';
import BackupModal from './components/BackupModal';
import { INITIAL_ENTRIES, CATEGORIES } from './data/initialData';
import { DictionaryEntry, CategoryType, StatusFilterType, SortByType } from './types';
import { loadEntries, saveEntries } from './utils/storageService';
import { SearchX, Loader2, Plus, BookOpen } from 'lucide-react';

const DARK_MODE_KEY = 'toeic_master_dark_mode';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem(DARK_MODE_KEY) === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  // Entries and local storage state
  const [entries, setEntries] = useState<DictionaryEntry[]>(INITIAL_ENTRIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [storageSource, setStorageSource] = useState<'local_file' | 'local_storage'>('local_file');

  // Load entries from local file on startup
  useEffect(() => {
    async function initData() {
      setIsLoading(true);
      const res = await loadEntries();
      setEntries(res.entries);
      setStorageSource(res.source);
      setIsLoading(false);
    }
    initData();
  }, []);

  // Sync to local disk file whenever entries change
  const persistEntries = useCallback(async (updatedEntries: DictionaryEntry[]) => {
    setEntries(updatedEntries);
    setIsSaving(true);
    await saveEntries(updatedEntries);
    setIsSaving(false);
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState('Tất cả các phần');
  const [selectedTopic, setSelectedTopic] = useState('Tất cả chủ đề');
  const [selectedBand, setSelectedBand] = useState('Tất cả mục tiêu');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [sortBy, setSortBy] = useState<SortByType>('newest');

  // Modal States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = entries.filter(e => e.category === cat.id).length;
      }
    });
    return counts;
  }, [entries]);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // 1. Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = entry.title?.toLowerCase().includes(q);
        const matchMeaningVi = entry.meaningVi?.toLowerCase().includes(q);
        const matchMeaningEn = entry.meaningEn?.toLowerCase().includes(q);
        const matchMeanings = entry.meanings?.some(m => 
          m.meaningVi?.toLowerCase().includes(q) || 
          m.meaningEn?.toLowerCase().includes(q) || 
          m.partOfSpeech?.toLowerCase().includes(q) ||
          m.pattern?.toLowerCase().includes(q) ||
          m.exampleEn?.toLowerCase().includes(q)
        );
        const matchFormula = entry.formula?.toLowerCase().includes(q);
        const matchComponents = entry.components?.toLowerCase().includes(q);
        const matchTip = entry.toeicTip?.toLowerCase().includes(q);
        const matchCollocations = entry.collocations?.some(c => c.toLowerCase().includes(q));
        const matchWordFamily = entry.wordFamily?.some(w => w.word.toLowerCase().includes(q) || (w.meaning && w.meaning.toLowerCase().includes(q)));

        if (!matchTitle && !matchMeaningVi && !matchMeaningEn && !matchMeanings && !matchFormula && !matchComponents && !matchTip && !matchCollocations && !matchWordFamily) {
          return false;
        }
      }

      // 3. Part Filter
      if (selectedPart !== 'Tất cả các phần') {
        const partNum = selectedPart.split(':')[0].trim();
        if (entry.toeicPart && !entry.toeicPart.includes(partNum)) {
          return false;
        }
      }

      // 4. Topic Filter
      if (selectedTopic !== 'Tất cả chủ đề') {
        if (entry.topic !== selectedTopic) {
          return false;
        }
      }

      // 5. Band Filter
      if (selectedBand !== 'Tất cả mục tiêu') {
        if (entry.band !== selectedBand) {
          return false;
        }
      }

      // 6. Status Filter
      if (statusFilter === 'favorite' && !entry.favorite) return false;
      if (statusFilter === 'mastered' && !entry.mastered) return false;
      if (statusFilter === 'learning' && entry.mastered) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (sortBy === 'oldest') {
        return (a.id || '').localeCompare(b.id || '');
      }
      if (sortBy === 'az') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'za') {
        return (b.title || '').localeCompare(a.title || '');
      }
      if (sortBy === 'reviews') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      return 0;
    });
  }, [entries, selectedCategory, searchQuery, selectedPart, selectedTopic, selectedBand, statusFilter, sortBy]);

  // Handlers
  const handleAddNew = () => {
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa mục này khỏi từ điển local?')) {
      const updated = entries.filter(e => e.id !== id);
      persistEntries(updated);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, favorite: !e.favorite } : e);
    persistEntries(updated);
  };

  const handleToggleMastered = (id: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, mastered: !e.mastered } : e);
    persistEntries(updated);
  };

  const handleSaveEntry = (entryData: DictionaryEntry) => {
    let updated: DictionaryEntry[];
    if (editingEntry) {
      updated = entries.map(e => e.id === entryData.id ? entryData : e);
    } else {
      updated = [entryData, ...entries];
    }
    persistEntries(updated);
  };

  const handleUpdateSingleEntry = (updatedEntry: DictionaryEntry) => {
    const updated = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    persistEntries(updated);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedPart('Tất cả các phần');
    setSelectedTopic('Tất cả chủ đề');
    setSelectedBand('Tất cả mục tiêu');
    setStatusFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] dark:bg-[#18181b] transition-colors">

      {/* Header */}
      <Header
        onAddNew={handleAddNew}
        onOpenFlashcard={() => setIsFlashcardOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        totalCount={entries.length}
        masteredCount={entries.filter(e => e.mastered).length}
        storageSource={storageSource}
        isSaving={isSaving}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* Banner with Sweetpattern */}
        <StatsBanner
          entries={entries}
          counts={categoryCounts}
          storageSource={storageSource}
        />

        {/* Categories Tab Bar */}
        <CategoryNav
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />

        {/* Search & Filters */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          selectedBand={selectedBand}
          setSelectedBand={setSelectedBand}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Results Header count */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1 font-mono">
          <p>
            {filteredEntries.length} mục
            {isSaving && <span className="ml-2 text-[#d85c38] font-bold">• Đang lưu local...</span>}
          </p>
          {(searchQuery || selectedCategory !== 'all' || selectedPart !== 'Tất cả các phần' || statusFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-[#d85c38] underline font-bold"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#d85c38] mb-2" />
            <p className="text-xs text-stone-500 font-mono">Đang đọc data/dictionary.json...</p>
          </div>
        ) : filteredEntries.length > 0 ? (
          /* Entry Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onToggleMastered={handleToggleMastered}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          /* Empty State styled with Sweetaesthetic (Terracotta & Cream, NO yellow-black) */
          <div className="relative rounded-2xl border-2 border-stone-900 dark:border-stone-700 p-8 sm:p-12 text-center space-y-4 shadow-solid overflow-hidden bg-white dark:bg-stone-900">

            {/* Terracotta Badge */}
            <div className="w-12 h-12 rounded-xl bg-[#d85c38] text-white flex items-center justify-center mx-auto border-2 border-stone-900 shadow-solid-sm">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                Sổ tay từ điển đang trống
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                Bấm nút bên dưới để bắt đầu thêm từ vựng, ngữ pháp, cấu trúc hay idiom đầu tiên.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d85c38] hover:bg-[#b94826] text-white font-bold text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm mục đầu tiên</span>
              </button>
            </div>
          </div>
        ) : (
          /* Filtered No Results State */
          <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 p-8 text-center space-y-3 shadow-solid">
            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center mx-auto border-2 border-stone-900 dark:border-stone-700">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Không tìm thấy mục nào phù hợp
            </h3>
            <div className="pt-1 flex justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 text-xs font-bold hover:bg-stone-100"
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={handleAddNew}
                className="px-3.5 py-1.5 rounded-lg bg-[#d85c38] hover:bg-[#b94826] text-white font-bold text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
              >
                + Thêm từ
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="border-t-2 border-stone-900 dark:border-stone-800 bg-[#faf7f2] dark:bg-[#18181b] py-4 text-center text-xs text-stone-600 dark:text-stone-400 font-mono mt-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="font-bold text-stone-900 dark:text-stone-100">SweetTOEIC</span>
          <span>data/dictionary.json</span>
        </div>
      </footer>

      {/* Modals */}
      <EntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSave={handleSaveEntry}
        editingEntry={editingEntry}
      />

      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        entries={filteredEntries.length > 0 ? filteredEntries : entries}
        onUpdateEntry={handleUpdateSingleEntry}
      />

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        entries={entries}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        entries={entries}
        onImportEntries={(imported) => persistEntries(imported)}
        onResetEntries={(reset) => persistEntries(reset)}
        storageSource={storageSource}
      />

    </div>
  );
};

export default App;
