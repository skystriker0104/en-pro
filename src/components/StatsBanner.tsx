import React from 'react';
import { HardDrive } from 'lucide-react';
import { DictionaryEntry } from '../types';

interface StatsBannerProps {
  entries: DictionaryEntry[];
  counts: Record<string, number>;
  storageSource: 'local_file' | 'local_storage';
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ entries }) => {
  const total = entries.length;
  const mastered = entries.filter(e => e.mastered).length;
  const favorites = entries.filter(e => e.favorite).length;
  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div
      className="relative rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-solid overflow-hidden p-3 sm:p-5 mb-5"
      style={{
        backgroundImage: "url('/ngot-pattern.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "260px"
      }}
    >
      {/* Subtle tint overlay */}
      <div className="absolute inset-0 bg-stone-900/10 dark:bg-black/40 pointer-events-none" />

      {/* Solid Inner Card */}
      <div className="relative z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-xl border-2 border-stone-900 dark:border-stone-700 p-4 sm:p-5 shadow-solid-sm space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title & minimal indicator */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-[#d85c38] text-white px-2 py-0.5 rounded">
                Sweet2016
              </span>
             
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
              Từ điển Sweet
            </h1>
          </div>

          {/* Minimal metrics in stamp blocks */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-[#faf7f2] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 px-3 py-1.5 rounded-lg text-center min-w-[65px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Tổng mục</span>
              <span className="text-base font-black font-mono">{total}</span>
            </div>

            <div className="bg-[#faf7f2] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 px-3 py-1.5 rounded-lg text-center min-w-[65px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Đã thuộc</span>
              <span className="text-base font-black font-mono text-emerald-700 dark:text-emerald-400">{mastered}</span>
            </div>

            <div className="bg-[#faf7f2] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 px-3 py-1.5 rounded-lg text-center min-w-[65px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Yêu thích</span>
              <span className="text-base font-black font-mono text-[#d85c38]">{favorites}</span>
            </div>

            <div className="bg-[#faf7f2] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 px-3 py-1.5 rounded-lg text-center min-w-[65px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">Tiến độ</span>
              <span className="text-base font-black font-mono">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Solid flat progress bar in SweetTerracotta */}
        <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-400 dark:border-stone-700">
          <div
            className="h-full bg-[#d85c38] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

      </div>
    </div>
  );
};

export default StatsBanner;
