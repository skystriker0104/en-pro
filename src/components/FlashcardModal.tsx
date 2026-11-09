import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle
} from 'lucide-react';
import { speak } from '../utils/speech';
import { DictionaryEntry } from '../types';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: DictionaryEntry[];
  onUpdateEntry: (entry: DictionaryEntry) => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ 
  isOpen, 
  onClose, 
  entries, 
  onUpdateEntry 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const reviewQueue = [...entries].sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        if (!a.mastered && b.mastered) return -1;
        return 0;
      });
      setFilteredEntries(reviewQueue);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionCompleted(false);
    }
  }, [isOpen, entries]);

  const currentEntry = filteredEntries[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredEntries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRate = (quality: number) => {
    if (!currentEntry) return;

    const updatedReviewCount = (currentEntry.reviewCount || 0) + 1;

    onUpdateEntry({
      ...currentEntry,
      reviewCount: updatedReviewCount,
      mastered: quality === 4 ? true : currentEntry.mastered,
      lastReviewed: new Date().toISOString().split('T')[0]
    });

    handleNext();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-xl bg-[#faf6ed] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl shadow-solid-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3 border-b-2 border-stone-900 dark:border-stone-700 flex items-center justify-between bg-white dark:bg-stone-800">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
              Flashcard
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              ({currentIndex + 1}/{filteredEntries.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content or Completion Screen */}
        <div className="p-5">
          {sessionCompleted || !currentEntry ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-200 text-stone-950 border-2 border-stone-900 flex items-center justify-center mx-auto shadow-solid-sm">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                Xong lượt ôn tập!
              </h3>
              <div className="pt-3 flex justify-center gap-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setSessionCompleted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#d85c38] hover:bg-[#b94826] text-white font-bold text-xs border-2 border-stone-900 shadow-solid-sm"
                >
                  Ôn lại
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border-2 border-stone-900 text-stone-900 dark:text-stone-100 font-bold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Flashcard container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[280px] rounded-2xl p-6 flex flex-col justify-between border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-solid relative transition-all"
              >
                {!isFlipped ? (
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded border border-stone-300 dark:border-stone-600">
                        {currentEntry.category}
                      </span>
                      {currentEntry.category !== 'grammar' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(currentEntry.title);
                          }}
                          className="p-1.5 rounded-lg border border-stone-900 bg-[#faf6ed] hover:bg-stone-100 text-stone-900"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="text-center my-auto py-4">
                      <h2 className="text-3xl font-black font-serif text-stone-900 dark:text-stone-100 mb-1">
                        {currentEntry.title}
                      </h2>
                      {currentEntry.phonetic && (
                        <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                          {currentEntry.phonetic}
                        </p>
                      )}
                    </div>

                    <div className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1 font-mono">
                      <RotateCw className="w-3 h-3" />
                      <span>Nhấp để lật thẻ</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-1.5">
                      <span className="text-[11px] font-mono font-black uppercase text-stone-500">
                        Đáp án
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speak(currentEntry.title);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-900"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentEntry.meanings && currentEntry.meanings.length > 1 ? (
                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                          {currentEntry.meanings.map((m, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-[#faf7f2] dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 text-xs space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                {m.pattern && (
                                  <span className="font-mono text-[10px] font-black text-[#d85c38] dark:text-[#f48a6a] bg-orange-100/70 dark:bg-[#d85c38]/20 px-1.5 py-0.2 rounded border border-[#d85c38]/30">
                                    {m.pattern}
                                  </span>
                                )}
                                <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                                  {m.partOfSpeech}
                                </span>
                                <span className="text-[9px] font-mono text-stone-400 font-bold">#{idx + 1}</span>
                              </div>
                              <p className="font-bold text-stone-900 dark:text-stone-100">{m.meaningVi}</p>
                              {m.meaningEn && <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">{m.meaningEn}</p>}
                              {m.exampleEn && (
                                <p className="text-[10px] text-stone-600 dark:text-stone-300 italic pt-0.5">
                                  "{m.exampleEn}" {m.exampleVi && <span className="not-italic text-stone-400">→ {m.exampleVi}</span>}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {currentEntry.meanings?.[0]?.pattern && (
                            <span className="inline-block font-mono text-xs font-black text-[#d85c38] dark:text-[#f48a6a] bg-orange-100/70 dark:bg-[#d85c38]/20 px-2 py-0.5 rounded border border-[#d85c38]/30">
                              {currentEntry.meanings[0].pattern}
                            </span>
                          )}
                          <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                            {currentEntry.meaningVi}
                          </h4>
                        </div>
                      )}

                      {currentEntry.formula && (
                        <div className="bg-[#faf7f2] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 p-2 rounded-lg font-mono text-xs text-stone-900 dark:text-stone-100">
                          {currentEntry.formula}
                        </div>
                      )}

                      {currentEntry.examples?.[0] && (
                        <div className="bg-[#faf6ed] dark:bg-stone-900 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
                          <p className="font-medium text-stone-900 dark:text-stone-100">
                            "{currentEntry.examples[0].en}"
                          </p>
                          {currentEntry.examples[0].vi && (
                            <p className="text-stone-500 mt-0.5">
                              → {currentEntry.examples[0].vi}
                            </p>
                          )}
                        </div>
                      )}

                      {currentEntry.toeicTip && (
                        <div className="bg-amber-100 dark:bg-stone-900 p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200">
                          <span className="font-bold">Mẹo: </span>
                          {currentEntry.toeicTip}
                        </div>
                      )}
                    </div>

                    <div className="text-center text-[10px] text-stone-400 font-mono">
                      Bấm lại để lật về
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Buttons */}
              {isFlipped && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRate(1)}
                    className="py-2 rounded-xl bg-rose-200 text-stone-950 font-black text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Quên
                  </button>
                  <button
                    onClick={() => handleRate(2)}
                    className="py-2 rounded-xl bg-amber-200 text-stone-950 font-black text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Khó
                  </button>
                  <button
                    onClick={() => handleRate(3)}
                    className="py-2 rounded-xl bg-sky-200 text-stone-950 font-black text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Nhớ
                  </button>
                  <button
                    onClick={() => handleRate(4)}
                    className="py-2 rounded-xl bg-emerald-200 text-stone-950 font-black text-xs border-2 border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
                  >
                    Đã thuộc
                  </button>
                </div>
              )}

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 text-xs font-bold disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" /> Trước
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 text-xs font-bold"
                >
                  Sau <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FlashcardModal;
