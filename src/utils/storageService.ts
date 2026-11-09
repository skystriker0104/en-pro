import { DictionaryEntry } from '../types';

const LOCAL_STORAGE_KEY = 'toeic_master_dictionary_v1';

// Load entries from local file API (data/dictionary.json), fallback to localStorage
export async function loadEntries(): Promise<{ entries: DictionaryEntry[]; source: 'local_file' | 'local_storage' }> {
  try {
    const response = await fetch('/api/entries');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return { entries: data, source: 'local_file' };
      }
    }
  } catch (err) {
    console.warn('Local API server not responding, using localStorage', err);
  }

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return { entries: parsed, source: 'local_storage' };
      }
    }
  } catch (e) {
    console.error('Error reading localStorage', e);
  }

  return { entries: [], source: 'local_storage' };
}

// Save entries to local file (data/dictionary.json) + localStorage
export async function saveEntries(entries: DictionaryEntry[]): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }

  try {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entries)
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not save to local disk file:', err);
    return false;
  }
}
