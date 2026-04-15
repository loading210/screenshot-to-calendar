import { useState } from 'react';

const STORAGE_KEY = 'ollama_settings';

export interface Settings {
  ollamaUrl: string;
  model: string;
}

const DEFAULTS: Settings = {
  ollamaUrl: 'http://localhost:11434',
  model: 'llama3.1:8b',
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load);

  function save(next: Settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSettings(next);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULTS);
  }

  return { settings, save, reset };
}
