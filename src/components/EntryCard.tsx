import React, { useState } from 'react';
import { 
  Volume2, 
  Star, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';
import { speak } from '../utils/speech';
import { DictionaryEntry } from '../types';

interface EntryCardProps {
  entry: DictionaryEntry;
  onEdit: (entry: DictionaryEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMastered: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ 
  entry, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onToggleMastered 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (text: string) => {
    setIsPlaying(true);
    speak(text);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  // Solid flat category color badge
  const categoryStyles: Record<string, { label: string; badge: string }> = {
    vocabulary: { label: 'Từ vựng', badge: 'bg-sky-200 text-stone-900' },
    grammar: { label: 'Ngữ pháp', badge: 'bg-rose-200 text-stone-900' },
    structure: { label: 'Phrasal Verb / Cấu trúc', badge: 'bg-amber-200 text-stone-900' },
    noun_phrase: { label: 'Cụm danh từ', badge: 'bg-emerald-200 text-stone-900' },
    idiom: { label: 'Idiom', badge: 'bg-purple-200 text-stone-900' }
  };

  const style = categoryStyles[entry.category] || categoryStyles.vocabulary;

  return (
    <div className={`bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-solid hover:-translate-y-0.5 hover:shadow-solid-lg transition-all flex flex-col justify-between overflow-hidden ${
      entry.mastered ? 'ring-2 ring-emerald-500/40' : ''
    }`}>
      
      {/* Top Banner & Category Indicators */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Pill */}
            <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded border border-stone-900 dark:border-stone-700 ${style.badge}`}>
              {style.label}
            </span>

            {/* TOEIC Part Tag */}
            {entry.toeicPart && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                {entry.toeicPart}
              </span>
            )}

            {/* Target Band */}
            {entry.band && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                {entry.band}
              </span>
            )}

            {/* Part of Speech */}
            {entry.partOfSpeech && entry.category === 'vocabulary' && (
              <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                ({entry.partOfSpeech})
              </span>
            )}
          </div>

          {/* Quick Actions (Favorite & Mastered) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(entry.id)}
              className={`p-1 rounded transition-colors ${
                entry.favorite 
                  ? 'text-amber-500' 
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title={entry.favorite ? "Bỏ yêu thích" : "Yêu thích"}
            >
              <Star className={`w-4 h-4 ${entry.favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onToggleMastered(entry.id)}
              className={`p-1 rounded transition-colors ${
                entry.mastered 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title={entry.mastered ? "Đã thuộc" : "Đánh dấu đã thuộc"}
            >
              <CheckCircle2 className={`w-4 h-4 ${entry.mastered ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title / Word & Audio */}
        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
          <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {entry.title}
          </h3>

          {/* Audio Pronunciation Button */}
          {entry.category !== 'grammar' && (
            <button
              onClick={() => handleSpeak(entry.title)}
              className={`p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors ${
                isPlaying ? 'text-[#d85c38] animate-pulse' : ''
              }`}
              title="Phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* Phonetic (IPA) */}
          {entry.phonetic && (
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              {entry.phonetic}
            </span>
          )}
        </div>

        {/* Multiple Meanings & Multiple Parts of Speech / Patterns */}
        {entry.meanings && entry.meanings.length > 1 ? (
          <div className="space-y-2 mb-3">
            {entry.meanings.map((m, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-xl bg-[#faf7f2] dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  {m.pattern && (
                    <span className="font-mono text-xs font-black text-[#d85c38] dark:text-[#f48a6a] bg-orange-100/70 dark:bg-[#d85c38]/20 px-2 py-0.5 rounded border border-[#d85c38]/30">
                      {m.pattern}
                    </span>
                  )}
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                    {m.partOfSpeech}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 font-bold">#{idx + 1}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {m.meaningVi}
                </p>
                {m.meaningEn && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                    {m.meaningEn}
                  </p>
                )}
                {m.exampleEn && (
                  <div className="mt-1 pt-1 border-t border-stone-200 dark:border-stone-700/60 text-[11px]">
                    <p className="text-stone-700 dark:text-stone-300 italic">"{m.exampleEn}"</p>
                    {m.exampleVi && (
                      <p className="text-stone-500 dark:text-stone-400">→ {m.exampleVi}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Single Meaning */
          <div className="mb-3 space-y-1">
            {entry.meanings?.[0]?.pattern && (
              <span className="inline-block font-mono text-xs font-black text-[#d85c38] dark:text-[#f48a6a] bg-orange-100/70 dark:bg-[#d85c38]/20 px-2 py-0.5 rounded border border-[#d85c38]/30 mb-0.5">
                {entry.meanings[0].pattern}
              </span>
            )}
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {entry.meaningVi}
            </p>
            {entry.meaningEn && (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {entry.meaningEn}
              </p>
            )}
            {entry.meanings?.[0]?.exampleEn && (
              <div className="mt-1 pt-1 border-t border-stone-200 dark:border-stone-700/60 text-[11px]">
                <p className="text-stone-700 dark:text-stone-300 italic">"{entry.meanings[0].exampleEn}"</p>
                {entry.meanings[0].exampleVi && (
                  <p className="text-stone-500 dark:text-stone-400">→ {entry.meanings[0].exampleVi}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Formula (for Grammar) */}
        {entry.formula && entry.category === 'grammar' && (
          <div className="mb-3 bg-[#faf7f2] dark:bg-stone-800 p-2.5 rounded-xl font-mono text-xs text-stone-900 dark:text-stone-100 whitespace-pre-line border-2 border-stone-900 dark:border-stone-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">Công thức:</span>
            {entry.formula}
          </div>
        )}

        {/* Components */}
        {entry.components && (
          <div className="mb-3 p-2 rounded-xl bg-emerald-50 dark:bg-stone-800 border border-emerald-300 dark:border-stone-700 text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-300">Cấu tạo: </span>
            <span className="text-stone-700 dark:text-stone-300">{entry.components}</span>
          </div>
        )}

        {/* Business Context */}
        {entry.businessContext && (
          <div className="mb-3 p-2 rounded-xl bg-purple-50 dark:bg-stone-800 border border-purple-300 dark:border-stone-700 text-xs">
            <span className="font-bold text-purple-900 dark:text-purple-300">Ngữ cảnh: </span>
            <span className="text-stone-700 dark:text-stone-300">{entry.businessContext}</span>
          </div>
        )}

        {/* Word Family */}
        {entry.wordFamily && entry.wordFamily.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Word Family:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {entry.wordFamily.map((wf, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[#faf6ed] dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                >
                  <span className="font-mono text-[10px] uppercase font-bold text-stone-500">
                    {wf.pos}:
                  </span>
                  <span className="font-semibold">{wf.word}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Collocations */}
        {entry.collocations && entry.collocations.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {entry.collocations.map((col, idx) => (
                <span key={idx} className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                  • {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Example Sentences */}
        {entry.examples && entry.examples.length > 0 && (
          <div className="space-y-1.5 mb-3 bg-[#faf6ed] dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700/80">
            {entry.examples.map((ex, idx) => (
              <div key={idx} className="text-xs">
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  "{ex.en}"
                </p>
                {ex.vi && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    → {ex.vi}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TOEIC Tip Box */}
        {entry.toeicTip && (
          <div className="p-2.5 rounded-xl bg-amber-100/80 dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs">
            <div className="flex items-center gap-1 font-bold text-stone-900 dark:text-amber-400 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Bẫy đề thi:</span>
            </div>
            <p className="text-stone-800 dark:text-stone-300 text-[11px] leading-relaxed">
              {entry.toeicTip}
            </p>
          </div>
        )}

      </div>

      {/* Card Footer */}
      <div className="px-5 py-2 bg-stone-100 dark:bg-stone-800/80 border-t-2 border-stone-900 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span className="truncate max-w-[150px]">
          {entry.topic || ''}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-1 hover:text-stone-900 dark:hover:text-stone-100 rounded"
            title="Sửa"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1 hover:text-rose-600 dark:hover:text-rose-400 rounded"
            title="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default EntryCard;
