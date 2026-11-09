import React from 'react';
import { Search, X, Star, CheckCircle2, Clock } from 'lucide-react';
import { TOEIC_PARTS, TOEIC_TOPICS, TOEIC_BANDS } from '../data/initialData';
import { StatusFilterType, SortByType } from '../types';
import CustomSelect from './CustomSelect';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPart: string;
  setSelectedPart: (part: string) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  selectedBand: string;
  setSelectedBand: (band: string) => void;
  statusFilter: StatusFilterType;
  setStatusFilter: (status: StatusFilterType) => void;
  sortBy: SortByType;
  setSortBy: (sort: SortByType) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPart,
  setSelectedPart,
  selectedTopic,
  setSelectedTopic,
  selectedBand,
  setSelectedBand,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-4 shadow-solid space-y-3 transition-colors">
      
      {/* Top Search & Status Tabs */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm từ vựng, ngữ pháp, nghĩa tiếng Việt, cấu trúc..."
            className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl bg-[#faf6ed] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 focus:outline-none focus:ring-0 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-900 dark:border-stone-700 transition-all ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setStatusFilter('favorite')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-900 dark:border-stone-700 transition-all ${
              statusFilter === 'favorite'
                ? 'bg-[#d85c38] text-white font-bold'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Yêu thích</span>
          </button>
          <button
            onClick={() => setStatusFilter('learning')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-900 dark:border-stone-700 transition-all ${
              statusFilter === 'learning'
                ? 'bg-sky-200 text-stone-950 font-black'
                : 'bg-[#faf6ed] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Cần ôn</span>
          </button>
          <button
            onClick={() => setStatusFilter('mastered')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-900 dark:border-stone-700 transition-all ${
              statusFilter === 'mastered'
                ? 'bg-emerald-300 text-stone-950 font-black'
                : 'bg-[#faf6ed] dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã thuộc</span>
          </button>
        </div>

      </div>

      {/* Dropdown Filters row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
        
        {/* TOEIC Part */}
        <div className="w-44">
          <CustomSelect
            value={selectedPart}
            onChange={setSelectedPart}
            options={TOEIC_PARTS}
          />
        </div>

        {/* TOEIC Topic */}
        <div className="w-52">
          <CustomSelect
            value={selectedTopic}
            onChange={setSelectedTopic}
            options={TOEIC_TOPICS}
          />
        </div>

        {/* Target Band */}
        <div className="w-36">
          <CustomSelect
            value={selectedBand}
            onChange={setSelectedBand}
            options={TOEIC_BANDS}
          />
        </div>

        {/* Sort By */}
        <div className="w-36 ml-auto">
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val as SortByType)}
            options={[
              { value: 'newest', label: 'Mới nhất' },
              { value: 'oldest', label: 'Cũ nhất' },
              { value: 'az', label: 'A - Z' },
              { value: 'za', label: 'Z - A' },
              { value: 'reviews', label: 'Lượt ôn tập' }
            ]}
          />
        </div>

      </div>

    </div>
  );
};

export default SearchBar;
