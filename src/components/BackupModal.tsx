import React, { useRef, useState } from 'react';
import { 
  X, 
  RotateCcw, 
  FileText, 
  FileSpreadsheet, 
  Check, 
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { INITIAL_ENTRIES } from '../data/initialData';
import { DictionaryEntry } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: DictionaryEntry[];
  onImportEntries: (entries: DictionaryEntry[]) => void;
  onResetEntries: (entries: DictionaryEntry[]) => void;
  storageSource: 'local_file' | 'local_storage';
}

export const BackupModal: React.FC<BackupModalProps> = ({ 
  isOpen, 
  onClose, 
  entries, 
  onImportEntries, 
  onResetEntries
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `toeic-dictionary-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMsg({ type: 'success', text: 'Đã xuất file JSON!' });
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Title', 'Phonetic', 'PartOfSpeech', 'MeaningVi', 'MeaningEn', 'ToeicPart', 'Topic', 'Band', 'ToeicTip'];
    const rows = entries.map(e => [
      `"${e.category || ''}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${(e.phonetic || '').replace(/"/g, '""')}"`,
      `"${(e.partOfSpeech || '').replace(/"/g, '""')}"`,
      `"${(e.meaningVi || '').replace(/"/g, '""')}"`,
      `"${(e.meaningEn || '').replace(/"/g, '""')}"`,
      `"${(e.toeicPart || '').replace(/"/g, '""')}"`,
      `"${(e.topic || '').replace(/"/g, '""')}"`,
      `"${(e.band || '').replace(/"/g, '""')}"`,
      `"${(e.toeicTip || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `toeic-dictionary-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMsg({ type: 'success', text: 'Đã xuất file CSV!' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          onImportEntries(parsed);
          setMsg({ type: 'success', text: `Đã nạp ${parsed.length} mục vào máy local!` });
        } else {
          setMsg({ type: 'error', text: 'File JSON không hợp lệ.' });
        }
      } catch (err: any) {
        setMsg({ type: 'error', text: 'Lỗi: ' + err.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ từ điển về trạng thái trống không?')) {
      onResetEntries([]);
      setMsg({ type: 'success', text: 'Đã đưa từ điển về trạng thái trống!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf6ed] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl w-full max-w-md shadow-solid-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3 border-b-2 border-stone-900 dark:border-stone-700 flex items-center justify-between bg-white dark:bg-stone-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <h3 className="font-serif font-black text-base text-stone-900 dark:text-stone-100">Dữ liệu </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs font-medium">
          
          <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700">
            <span className="font-bold block text-stone-900 dark:text-stone-100 mb-0.5">Vị trí tệp máy tính:</span>
            <code className="font-mono text-stone-700 dark:text-amber-400 bg-stone-100 dark:bg-stone-900 px-1 py-0.5 rounded text-[11px]">
              data/dictionary.json
            </code>
          </div>

          {msg.text && (
            <div className={`p-2.5 rounded-lg border flex items-center gap-1.5 font-bold ${
              msg.type === 'success' 
                ? 'bg-emerald-200 text-stone-950 border-stone-900' 
                : 'bg-rose-200 text-stone-950 border-stone-900'
            }`}>
              {msg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{msg.text}</span>
            </div>
          )}

          {/* Export */}
          <div>
            <span className="font-bold text-stone-600 dark:text-stone-400 uppercase text-[10px] block mb-1.5">Xuất file</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold hover:bg-stone-100 text-stone-900 dark:text-stone-100 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Xuất JSON</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold hover:bg-stone-100 text-stone-900 dark:text-stone-100 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Xuất CSV (Excel)</span>
              </button>
            </div>
          </div>

          {/* Import */}
          <div>
            <span className="font-bold text-stone-600 dark:text-stone-400 uppercase text-[10px] block mb-1.5">Nhập tệp</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-100 shadow-solid-sm active:translate-x-0.5 active:translate-y-0.5"
            >
              Chọn file JSON để khôi phục
            </button>
          </div>

          {/* Reset */}
          <div className="pt-2 border-t border-stone-300 dark:border-stone-800">
            <button
              onClick={handleResetToDefault}
              className="w-full flex items-center justify-center gap-1 p-2 rounded-xl text-rose-700 dark:text-rose-400 border border-rose-400 font-bold hover:bg-rose-100/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa toàn bộ từ điển (Về trống)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BackupModal;
