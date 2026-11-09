import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { DictionaryEntry, CategoryType, WordFamilyItem, ExampleItem, WordMeaning } from '../types';
import CustomSelect from './CustomSelect';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: DictionaryEntry) => void;
  editingEntry: DictionaryEntry | null;
}

const POS_OPTIONS = [
  { value: 'verb', label: 'Động từ (Verb)' },
  { value: 'phrasal_verb', label: 'Cụm động từ (Phrasal Verb)' },
  { value: 'noun', label: 'Danh từ (Noun)' },
  { value: 'adj', label: 'Tính từ (Adj)' },
  { value: 'adv', label: 'Trạng từ (Adv)' },
  { value: 'collocation', label: 'Collocation' },
  { value: 'prep', label: 'Giới từ (Prep)' },
  { value: 'conj', label: 'Liên từ (Conj)' },
  { value: 'phrase', label: 'Cụm từ (Phrase)' }
];

const normalizePartOfSpeech = (rawPos: string): string => {
  const p = (rawPos || '').toLowerCase().trim();
  if (p.includes('phrasal')) return 'phrasal_verb';
  if (p.includes('colloc')) return 'collocation';
  if (p.includes('noun')) return 'noun';
  if (p.includes('verb')) return 'verb';
  if (p.includes('adj')) return 'adj';
  if (p.includes('adv')) return 'adv';
  if (p.includes('prep')) return 'prep';
  if (p.includes('conj')) return 'conj';
  if (p.includes('phrase') || p.includes('idiom')) return 'phrase';
  return 'noun';
};

export const EntryModal: React.FC<EntryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingEntry 
}) => {
  const [category, setCategory] = useState<CategoryType>('vocabulary');
  const [title, setTitle] = useState('');
  const [phonetic, setPhonetic] = useState('');

  // Support for multiple meanings and multiple parts of speech
  const [meaningsList, setMeaningsList] = useState<WordMeaning[]>([
    { partOfSpeech: 'noun', meaningVi: '', meaningEn: '' }
  ]);

  const [formula, setFormula] = useState('');
  const [components, setComponents] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [toeicTip, setToeicTip] = useState('');
  const [collocationsText, setCollocationsText] = useState('');
  const [synonymsText, setSynonymsText] = useState('');

  const [wordFamily, setWordFamily] = useState<WordFamilyItem[]>([
    { pos: 'n', word: '', meaning: '' },
    { pos: 'v', word: '', meaning: '' },
    { pos: 'adj', word: '', meaning: '' }
  ]);

  const [examples, setExamples] = useState<ExampleItem[]>([
    { en: '', vi: '' }
  ]);

  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setCategory(editingEntry.category || 'vocabulary');
      setTitle(editingEntry.title || '');
      setPhonetic(editingEntry.phonetic || '');

      // Load multiple meanings
      if (editingEntry.meanings && editingEntry.meanings.length > 0) {
        setMeaningsList(editingEntry.meanings);
      } else {
        setMeaningsList([
          {
            partOfSpeech: editingEntry.partOfSpeech || 'noun',
            meaningVi: editingEntry.meaningVi || '',
            meaningEn: editingEntry.meaningEn || ''
          }
        ]);
      }

      setFormula(editingEntry.formula || '');
      setComponents(editingEntry.components || '');
      setBusinessContext(editingEntry.businessContext || '');
      setToeicTip(editingEntry.toeicTip || '');
      setCollocationsText(editingEntry.collocations ? editingEntry.collocations.join(', ') : '');
      setSynonymsText(editingEntry.synonyms ? editingEntry.synonyms.join(', ') : '');
      setWordFamily(editingEntry.wordFamily && editingEntry.wordFamily.length > 0 
        ? editingEntry.wordFamily 
        : [{ pos: 'n', word: '', meaning: '' }]
      );
      setExamples(editingEntry.examples && editingEntry.examples.length > 0 
        ? editingEntry.examples 
        : [{ en: '', vi: '' }]
      );
    } else {
      setCategory('vocabulary');
      setTitle('');
      setPhonetic('');
      setMeaningsList([
        { partOfSpeech: 'noun', meaningVi: '', meaningEn: '' }
      ]);
      setFormula('');
      setComponents('');
      setBusinessContext('');
      setToeicTip('');
      setCollocationsText('');
      setSynonymsText('');
      setWordFamily([
        { pos: 'n', word: '', meaning: '' },
        { pos: 'v', word: '', meaning: '' },
        { pos: 'adj', word: '', meaning: '' }
      ]);
      setExamples([{ en: '', vi: '' }]);
    }
    setApiError('');
  }, [editingEntry, isOpen]);

  // Multiple Meanings handlers
  const handleAddMeaningRow = () => {
    setMeaningsList(prev => [
      ...prev,
      { partOfSpeech: 'verb', meaningVi: '', meaningEn: '' }
    ]);
  };

  const handleUpdateMeaning = (index: number, field: keyof WordMeaning, value: string) => {
    setMeaningsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveMeaningRow = (index: number) => {
    if (meaningsList.length > 1) {
      setMeaningsList(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Auto Lookup via Google Translate & Free Dictionary API
  const handleAutoLookup = async () => {
    if (!title.trim()) {
      setApiError('Vui lòng nhập từ tiếng Anh trước khi tra cứu.');
      return;
    }

    setIsLoadingApi(true);
    setApiError('');

    const trimmed = title.trim();

    try {
      // 1. Fetch Vietnamese Translation & POS breakdown via Google Translate API
      let primaryVi = '';
      const viByPos: Record<string, string[]> = {};
      const allPosList: string[] = [];

      try {
        const transRes = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&dt=bd&q=${encodeURIComponent(trimmed)}`
        );
        if (transRes.ok) {
          const transData = await transRes.json();
          // Primary translation
          if (transData?.[0]?.[0]?.[0]) {
            primaryVi = transData[0].map((chunk: any) => chunk[0]).join('').trim();
          }
          // Part of speech breakdown: [ ["noun", ["dòng nước", "hợp lý hóa"]], ["verb", ["sắp xếp hợp lý", "tinh giản"]] ]
          if (Array.isArray(transData?.[1])) {
            transData[1].forEach((item: any) => {
              if (item && item[0] && Array.isArray(item[1])) {
                const normPos = normalizePartOfSpeech(item[0]);
                if (!viByPos[normPos]) {
                  viByPos[normPos] = [];
                  allPosList.push(normPos);
                }
                const cleanList = item[1].map((s: any) => String(s).trim()).filter(Boolean);
                viByPos[normPos].push(...cleanList);
              }
            });
          }
        }
      } catch (transErr) {
        console.warn('Google translate fetch error:', transErr);
      }

      // Fallback for primaryVi using MyMemory if needed
      if (!primaryVi) {
        try {
          const mmRes = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|vi`
          );
          if (mmRes.ok) {
            const mmData = await mmRes.json();
            primaryVi = mmData?.responseData?.translatedText || '';
          }
        } catch (mmErr) {
          console.warn('MyMemory fallback error:', mmErr);
        }
      }

      // 2. Fetch Phonetic, English Definitions & Examples from Free Dictionary API
      let dictData: any = null;
      try {
        const dictRes = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmed.toLowerCase())}`
        );
        if (dictRes.ok) {
          const json = await dictRes.json();
          if (Array.isArray(json) && json.length > 0) {
            dictData = json[0];
          }
        }
      } catch (dictErr) {
        console.warn('Dictionary API error:', dictErr);
      }

      // 3. Fill Phonetic
      if (dictData) {
        const foundPhonetic = dictData.phonetic || (dictData.phonetics && dictData.phonetics.find((p: any) => p.text)?.text) || '';
        if (foundPhonetic) setPhonetic(foundPhonetic);
      }

      // 4. Build Meanings List combining Part of Speech, Vietnamese meaning, and English definition
      const extracted: WordMeaning[] = [];
      const isMultiWord = trimmed.includes(' ');

      if (dictData?.meanings && dictData.meanings.length > 0) {
        // Automatically switch category to 'structure' if it's a multi-word phrasal verb/structure
        if (isMultiWord && category === 'vocabulary') {
          setCategory('structure');
        }

        // Build from Dictionary API meanings
        for (const m of dictData.meanings) {
          let normPos = normalizePartOfSpeech(m.partOfSpeech || 'noun');
          if (isMultiWord && (normPos === 'verb' || normPos === 'phrase')) {
            normPos = 'phrasal_verb';
          }

          const defs = Array.isArray(m.definitions) ? m.definitions : [];

          // If phrasal verb or verb with multiple definitions, extract distinct patterns
          if (defs.length > 1 && (isMultiWord || normPos === 'phrasal_verb')) {
            for (const d of defs.slice(0, 4)) {
              if (extracted.length >= 6 || !d.definition) continue;

              const textToCheck = `${d.definition} ${d.example || ''}`.toLowerCase();
              let suggestedPattern = '';

              if (/\b(someone|person|somebody|staff|employee|people|bully|opponent|player|customer)\b/.test(textToCheck)) {
                suggestedPattern = `${trimmed} sb`;
              } else if (/\b(something|responsibility|project|task|work|job|cargo|appearance|role|challenge|issue|problem)\b/.test(textToCheck)) {
                suggestedPattern = `${trimmed} st`;
              }

              // Translate definition to Vietnamese
              let viMeaning = '';
              try {
                const trRes = await fetch(
                  `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(d.definition)}`
                );
                if (trRes.ok) {
                  const trJson = await trRes.json();
                  if (trJson?.[0]?.[0]?.[0]) {
                    viMeaning = trJson[0].map((chunk: any) => chunk[0]).join('').trim();
                  }
                }
              } catch (e) {
                viMeaning = primaryVi;
              }

              // Translate example if present
              let exVi = '';
              if (d.example) {
                try {
                  const exTrRes = await fetch(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(d.example)}`
                  );
                  if (exTrRes.ok) {
                    const exTrJson = await exTrRes.json();
                    if (exTrJson?.[0]?.[0]?.[0]) {
                      exVi = exTrJson[0].map((chunk: any) => chunk[0]).join('').trim();
                    }
                  }
                } catch (e) {}
              }

              extracted.push({
                partOfSpeech: normPos,
                pattern: suggestedPattern,
                meaningVi: viMeaning || primaryVi,
                meaningEn: d.definition,
                exampleEn: d.example || '',
                exampleVi: exVi
              });
            }
          } else {
            const enDef = m.definitions?.[0]?.definition || '';
            const viList = viByPos[normPos];
            const viDef = viList && viList.length > 0
              ? viList.slice(0, 3).join(', ')
              : primaryVi;

            if (extracted.length < 5) {
              extracted.push({
                partOfSpeech: normPos,
                pattern: '',
                meaningVi: viDef,
                meaningEn: enDef,
                exampleEn: m.definitions?.[0]?.example || ''
              });
            }
          }
        }
      } else if (allPosList.length > 0) {
        // Build from Google Translate POS breakdown if Dictionary API has no entries
        allPosList.forEach((pos) => {
          const viList = viByPos[pos] || [];
          if (extracted.length < 5) {
            extracted.push({
              partOfSpeech: pos,
              pattern: '',
              meaningVi: viList.slice(0, 3).join(', ') || primaryVi,
              meaningEn: ''
            });
          }
        });
      } else if (primaryVi) {
        // Simple single meaning fallback
        extracted.push({
          partOfSpeech: isMultiWord ? 'phrasal_verb' : 'noun',
          pattern: '',
          meaningVi: primaryVi,
          meaningEn: ''
        });
      }

      if (extracted.length > 0) {
        setMeaningsList(extracted);
      } else if (!primaryVi && !dictData) {
        throw new Error('Không tìm thấy thông tin tự động cho từ này. Vui lòng nhập thủ công.');
      }

      // 5. Example sentence & Vietnamese translation
      if (dictData?.meanings) {
        const sampleEx = dictData.meanings[0]?.definitions?.find((d: any) => d.example)?.example;
        if (sampleEx) {
          let exVi = '';
          try {
            const exRes = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(sampleEx)}`
            );
            if (exRes.ok) {
              const exData = await exRes.json();
              if (exData?.[0]?.[0]?.[0]) {
                exVi = exData[0].map((chunk: any) => chunk[0]).join('').trim();
              }
            }
          } catch (e) {
            // Ignore example translation failure
          }
          setExamples([{ en: sampleEx, vi: exVi }]);
        }

        // Synonyms
        const syns = dictData.meanings[0]?.synonyms || [];
        if (syns.length > 0 && !synonymsText) {
          setSynonymsText(syns.slice(0, 5).join(', '));
        }
      }

    } catch (err: any) {
      setApiError(err.message || 'Lỗi tra cứu trực tuyến.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleAddWordFamilyRow = () => {
    setWordFamily([...wordFamily, { pos: 'n', word: '', meaning: '' }]);
  };

  const handleUpdateWordFamily = (index: number, field: keyof WordFamilyItem, value: string) => {
    const updated = [...wordFamily];
    updated[index] = { ...updated[index], [field]: value };
    setWordFamily(updated);
  };

  const handleRemoveWordFamily = (index: number) => {
    setWordFamily(wordFamily.filter((_, i) => i !== index));
  };

  const handleAddExampleRow = () => {
    setExamples([...examples, { en: '', vi: '' }]);
  };

  const handleUpdateExample = (index: number, field: keyof ExampleItem, value: string) => {
    const updated = [...examples];
    updated[index] = { ...updated[index], [field]: value };
    setExamples(updated);
  };

  const handleRemoveExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập từ / cấu trúc / điểm ngữ pháp!');
      return;
    }

    const validMeanings = meaningsList.filter(m => m.meaningVi.trim() !== '' || (m.meaningEn && m.meaningEn.trim() !== ''));

    if (validMeanings.length === 0) {
      alert('Vui lòng nhập ít nhất một nghĩa tiếng Việt cho từ!');
      return;
    }

    const filteredWordFamily = wordFamily.filter(w => w.word.trim() !== '');
    const filteredExamples = examples.filter(ex => ex.en.trim() !== '');

    const collocations = collocationsText
      ? collocationsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const synonyms = synonymsText
      ? synonymsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Derive primary summary values for compatibility
    const primaryMeaningVi = validMeanings[0].meaningVi || '';
    const primaryMeaningEn = validMeanings[0].meaningEn || '';
    const allPos = Array.from(new Set(validMeanings.map(m => m.partOfSpeech))).join(', ');

    const entryData: DictionaryEntry = {
      id: editingEntry ? editingEntry.id : `entry-${Date.now()}`,
      category,
      title: title.trim(),
      phonetic: phonetic.trim(),
      partOfSpeech: allPos,
      meaningVi: primaryMeaningVi.trim(),
      meaningEn: primaryMeaningEn.trim(),
      meanings: validMeanings,
      formula: formula.trim(),
      components: components.trim(),
      businessContext: businessContext.trim(),
      toeicTip: toeicTip.trim(),
      collocations,
      synonyms,
      wordFamily: filteredWordFamily,
      examples: filteredExamples,
      favorite: editingEntry ? editingEntry.favorite : false,
      mastered: editingEntry ? editingEntry.mastered : false,
      reviewCount: editingEntry ? editingEntry.reviewCount : 0,
      lastReviewed: editingEntry ? editingEntry.lastReviewed : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    onSave(entryData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#faf7f2] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-solid-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-stone-900 dark:border-stone-700 flex items-center justify-between bg-white dark:bg-stone-800">
          <h2 className="font-bold text-lg text-stone-900 dark:text-stone-100">
            {editingEntry ? 'Sửa mục từ' : 'Thêm mục mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-4 text-xs font-medium">
          
          {/* Category Selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-[#d85c38] text-white font-bold shadow-solid-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {cat.label.split('(')[0]}
              </button>
            ))}
          </div>

          {/* Word & IPA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  {category === 'vocabulary' && 'Từ vựng (Word) *'}
                  {category === 'grammar' && 'Điểm ngữ pháp *'}
                  {category === 'structure' && 'Cấu trúc *'}
                  {category === 'noun_phrase' && 'Cụm danh từ *'}
                  {category === 'idiom' && 'Thành ngữ *'}
                </label>

                {category === 'vocabulary' && (
                  <button
                    type="button"
                    onClick={handleAutoLookup}
                    disabled={isLoadingApi}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#d85c38] underline"
                  >
                    {isLoadingApi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>Tra tự động</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: present, contract, record..."
                className="w-full px-3 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-sm focus:outline-none"
              />
              {apiError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {apiError}
                </p>
              )}
            </div>

            {/* Phonetic (IPA) */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Phiên âm (IPA)
              </label>
              <input
                type="text"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="/.../"
                className="w-full px-2.5 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* MULTIPLE MEANINGS & MULTIPLE PARTS OF SPEECH */}
          <div className="space-y-3 p-3.5 bg-white dark:bg-stone-850 rounded-2xl border-2 border-stone-900 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#d85c38]" />
                <span>Nghĩa & Từ loại ({meaningsList.length} nghĩa)</span>
              </span>
              <button
                type="button"
                onClick={handleAddMeaningRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#d85c38] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm nghĩa / từ loại khác
              </button>
            </div>

            <div className="space-y-3">
              {meaningsList.map((m, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[#faf7f2] dark:bg-stone-800 rounded-xl border-2 border-stone-300 dark:border-stone-700 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-stone-500">
                      Nghĩa #{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="w-40">
                        <CustomSelect
                          value={m.partOfSpeech}
                          onChange={(val) => handleUpdateMeaning(idx, 'partOfSpeech', val)}
                          options={POS_OPTIONS}
                        />
                      </div>

                      {meaningsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMeaningRow(idx)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Xóa nghĩa này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Specific Pattern / Structure (e.g. take on sb vs take on st) */}
                  <div>
                    <input
                      type="text"
                      value={m.pattern || ''}
                      onChange={(e) => handleUpdateMeaning(idx, 'pattern', e.target.value)}
                      placeholder="Mẫu / Dạng dùng cụ thể (VD: take on sb, take on st, look up to sb...)"
                      className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-900 text-[#d85c38] dark:text-[#f48a6a] font-mono text-xs font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-sans placeholder:font-normal"
                    />
                  </div>

                  {/* Vietnamese & English Meanings for this part of speech */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        required={idx === 0}
                        value={m.meaningVi}
                        onChange={(e) => handleUpdateMeaning(idx, 'meaningVi', e.target.value)}
                        placeholder="Nghĩa tiếng Việt *"
                        className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={m.meaningEn || ''}
                        onChange={(e) => handleUpdateMeaning(idx, 'meaningEn', e.target.value)}
                        placeholder="Định nghĩa tiếng Anh (tùy chọn)"
                        className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Specific example for this pattern / meaning */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-200 dark:border-stone-700/60">
                    <div>
                      <input
                        type="text"
                        value={m.exampleEn || ''}
                        onChange={(e) => handleUpdateMeaning(idx, 'exampleEn', e.target.value)}
                        placeholder="Ví dụ riêng cho dạng này (tùy chọn)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-[11px] focus:outline-none placeholder:text-stone-400"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={m.exampleVi || ''}
                        onChange={(e) => handleUpdateMeaning(idx, 'exampleVi', e.target.value)}
                        placeholder="Dịch ví dụ trên (tùy chọn)"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-[11px] focus:outline-none placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Formula - only for Grammar */}
          {category === 'grammar' && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block mb-1">
                Công thức ngữ pháp
              </label>
              <textarea
                rows={2}
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Ví dụ: If + S + had + V3/ed, S + would have + V3/ed..."
                className="w-full px-3 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-none placeholder:text-stone-400"
              />
            </div>
          )}

          {/* Word Family */}
          {category === 'vocabulary' && (
            <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border-2 border-stone-900 dark:border-stone-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-stone-700 dark:text-stone-300">
                  Word Family (Họ từ):
                </span>
                <button
                  type="button"
                  onClick={handleAddWordFamilyRow}
                  className="text-xs font-bold text-[#d85c38] underline"
                >
                  + Thêm
                </button>
              </div>

              {wordFamily.map((wf, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-24 shrink-0">
                    <CustomSelect
                      value={wf.pos}
                      onChange={(val) => handleUpdateWordFamily(idx, 'pos', val)}
                      options={[
                        { value: 'n', label: 'Noun' },
                        { value: 'v', label: 'Verb' },
                        { value: 'adj', label: 'Adj' },
                        { value: 'adv', label: 'Adv' }
                      ]}
                    />
                  </div>
                  <input
                    type="text"
                    value={wf.word}
                    onChange={(e) => handleUpdateWordFamily(idx, 'word', e.target.value)}
                    placeholder="Từ"
                    className="flex-1 px-2.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium focus:outline-none"
                  />
                  {wordFamily.length > 1 && (
                    <button type="button" onClick={() => handleRemoveWordFamily(idx)}>
                      <Trash2 className="w-3.5 h-3.5 text-stone-400 hover:text-rose-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Example Sentences */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-stone-700 dark:text-stone-300">
                Câu ví dụ:
              </span>
              <button
                type="button"
                onClick={handleAddExampleRow}
                className="text-xs font-bold text-[#d85c38] underline"
              >
                + Thêm
              </button>
            </div>

            {examples.map((ex, idx) => (
              <div key={idx} className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-900 dark:border-stone-700 space-y-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={ex.en}
                    onChange={(e) => handleUpdateExample(idx, 'en', e.target.value)}
                    placeholder="Tiếng Anh"
                    className="flex-1 px-2 py-1 rounded border border-stone-300 text-xs focus:outline-none"
                  />
                  {examples.length > 1 && (
                    <button type="button" onClick={() => handleRemoveExample(idx)}>
                      <Trash2 className="w-3.5 h-3.5 text-stone-400 hover:text-rose-600" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={ex.vi || ''}
                  onChange={(e) => handleUpdateExample(idx, 'vi', e.target.value)}
                  placeholder="Dịch tiếng Việt"
                  className="w-full px-2 py-1 rounded border border-stone-200 text-xs text-stone-600 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* Collocations & Synonyms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">Collocations (cách nhau dấu phẩy)</label>
              <input
                type="text"
                value={collocationsText}
                onChange={(e) => setCollocationsText(e.target.value)}
                placeholder="ví dụ: reach an agreement, at present"
                className="w-full px-2 py-1 rounded border border-stone-900 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">Từ đồng nghĩa</label>
              <input
                type="text"
                value={synonymsText}
                onChange={(e) => setSynonymsText(e.target.value)}
                placeholder="ví dụ: gift, current, introduce"
                className="w-full px-2 py-1 rounded border border-stone-900 text-xs"
              />
            </div>
          </div>

          {/* TOEIC Trap */}
          <div>
            <label className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400 block mb-1">
              Bẫy đề thi & Mẹo nhớ:
            </label>
            <textarea
              rows={2}
              value={toeicTip}
              onChange={(e) => setToeicTip(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border-2 border-stone-900 dark:border-stone-700 bg-amber-100/50 dark:bg-stone-800 text-xs focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t-2 border-stone-900 dark:border-stone-700 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-stone-400 font-bold text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#d85c38] hover:bg-[#b94826] text-white border-2 border-stone-900 font-bold text-xs shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
            >
              {editingEntry ? 'Lưu' : 'Thêm từ'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EntryModal;
