import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCw,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DictionaryEntry } from '../types';

interface QuizQuestion {
  type: string;
  sentence: string;
  translation?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  entryTitle: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: DictionaryEntry[];
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, entries }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const generateQuestions = (): QuizQuestion[] => {
    const list = [...entries];
    if (list.length === 0) return [];

    const generated: QuizQuestion[] = [];

    list.forEach((entry) => {
      // 1. From entries with Word Family
      if (entry.wordFamily && entry.wordFamily.length >= 2 && entry.examples && entry.examples.length > 0) {
        const example = entry.examples[0].en;
        const targetWord = entry.title;
        const regex = new RegExp(`\\b${targetWord}\\w*\\b`, 'i');
        if (regex.test(example)) {
          const matchResult = example.match(regex);
          if (matchResult) {
            const match = matchResult[0];
            const questionSentence = example.replace(regex, '_______');
            
            const options = [match];
            entry.wordFamily.forEach(wf => {
              if (wf.word && !options.includes(wf.word)) {
                options.push(wf.word);
              }
            });

            const fallbackSuffixes = ['ly', 'tion', 'ment', 'able', 'ing', 'ed'];
            let sIdx = 0;
            while (options.length < 4 && sIdx < fallbackSuffixes.length) {
              const fakeWord = targetWord + fallbackSuffixes[sIdx];
              if (!options.includes(fakeWord)) options.push(fakeWord);
              sIdx++;
            }

            const shuffledOptions = [...options.slice(0, 4)].sort(() => 0.5 - Math.random());

            generated.push({
              type: 'Dạng từ (Word Form)',
              sentence: questionSentence,
              translation: entry.examples[0].vi,
              correctAnswer: match,
              options: shuffledOptions,
              explanation: entry.toeicTip || `Dạng từ chuẩn: '${match}' (${entry.partOfSpeech || 'noun'}).`,
              entryTitle: entry.title
            });
          }
        }
      }

      // 2. From Grammar / Structure entries
      if (entry.category === 'grammar' || entry.category === 'structure') {
        if (entry.examples && entry.examples.length > 0) {
          const ex = entry.examples[0];
          const bracketMatch = ex.en.match(/\[(.*?)\]/);
          if (bracketMatch) {
            const choices = bracketMatch[1].split('/').map(c => c.trim());
            const correct = choices[0];
            const sentence = ex.en.replace(/\[(.*?)\]/, '_______');

            generated.push({
              type: 'Ngữ pháp (Grammar)',
              sentence: sentence,
              translation: ex.vi,
              correctAnswer: correct,
              options: choices.slice(0, 4),
              explanation: entry.toeicTip || `Áp dụng công thức: ${entry.formula || entry.title}`,
              entryTitle: entry.title
            });
          }
        }
      }

      // 3. Meaning question
      if (entry.meaningVi && entry.title) {
        const distractors = list
          .filter(e => e.id !== entry.id && e.meaningVi)
          .map(e => e.meaningVi)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        if (distractors.length >= 3) {
          const options = [entry.meaningVi, ...distractors].sort(() => 0.5 - Math.random());
          generated.push({
            type: 'Từ vựng & Cụm từ',
            sentence: `Ý nghĩa chuẩn xác của "${entry.title}" là gì?`,
            translation: entry.meaningEn || '',
            correctAnswer: entry.meaningVi,
            options: options,
            explanation: entry.toeicTip || (entry.meanings && entry.meanings.length > 1 
              ? `${entry.title}: ` + entry.meanings.map(m => `[${m.partOfSpeech}] ${m.meaningVi}`).join(' | ')
              : `${entry.title}: ${entry.meaningVi}`),
            entryTitle: entry.title
          });
        }
      }
    });

    return generated.sort(() => 0.5 - Math.random()).slice(0, 8);
  };

  useEffect(() => {
    if (isOpen) {
      const q = generateQuestions();
      setQuestions(q);
      setCurrentQIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setIsQuizCompleted(false);
    }
  }, [isOpen]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsQuizCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    const q = generateQuestions();
    setQuestions(q);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  if (!isOpen) return null;

  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-xl bg-[#faf6ed] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl shadow-solid-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-3 border-b-2 border-stone-900 dark:border-stone-700 flex items-center justify-between bg-white dark:bg-stone-800">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-base text-stone-900 dark:text-stone-100">
              Luyện trắc nghiệm
            </span>
            <span className="text-xs font-mono font-bold text-stone-500">
              ({currentQIndex + 1}/{questions.length} • {score} điểm)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {questions.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                Chưa đủ dữ liệu để tạo câu hỏi
              </h3>
              <p className="text-xs text-stone-500">
                Hãy thêm ít nhất vài từ vựng hoặc điểm ngữ pháp có ví dụ nhé.
              </p>
            </div>
          ) : isQuizCompleted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#d85c38] text-white border-2 border-stone-900 flex items-center justify-center mx-auto shadow-solid-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                Kết quả: {score} / {questions.length}
              </h3>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl bg-[#d85c38] hover:bg-[#b94826] text-white font-bold text-xs border-2 border-stone-900 shadow-solid-sm flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Làm lại
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
            <div className="space-y-4">
              
              {/* Question Sentence */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700">
                <p className="text-base font-bold text-stone-900 dark:text-stone-100 leading-relaxed font-serif">
                  {currentQ.sentence}
                </p>
                {currentQ.translation && (
                  <p className="text-xs text-stone-500 mt-1 italic">
                    Gợi ý: "{currentQ.translation}"
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQ.options.map((opt, idx) => {
                  const letters = ['(A)', '(B)', '(C)', '(D)'];
                  const isCorrect = opt === currentQ.correctAnswer;
                  const isUserSelected = selectedOption === opt;

                  let btnStyle = "border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-100";

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = "border-2 border-stone-900 bg-emerald-200 text-stone-950 font-black";
                    } else if (isUserSelected && !isCorrect) {
                      btnStyle = "border-2 border-stone-900 bg-rose-200 text-stone-950 font-black";
                    } else {
                      btnStyle = "opacity-40 border border-stone-300 bg-white";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3 rounded-xl text-left transition-all flex items-center justify-between text-xs font-bold ${btnStyle}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-stone-500">{letters[idx]}</span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                      {isAnswered && isUserSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswered && (
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs space-y-1.5 animate-in fade-in">
                  <p className="font-bold text-stone-900 dark:text-amber-300">
                    💡 {currentQ.explanation}
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#d85c38] hover:bg-[#b94826] text-white font-bold text-xs border border-stone-900 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <span>{currentQIndex === questions.length - 1 ? 'Xem kết quả' : 'Tiếp theo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default QuizModal;
