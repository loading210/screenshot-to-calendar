import { useState, useRef, useEffect } from 'react';
import type { Settings } from '../hooks/useSettings';

interface Props {
  settings: Settings;
  onSave: (s: Settings) => void;
}

export function SettingsPanel({ settings, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(settings.ollamaUrl);
  const [model, setModel] = useState(settings.model);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(settings.ollamaUrl);
    setModel(settings.model);
  }, [settings]);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleSave() {
    onSave({ ollamaUrl: url.trim(), model: model.trim() });
    setOpen(false);
  }

  const isMixedContent =
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.trim().startsWith('http://');

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        title="Ollama settings"
        className={[
          'flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150 cursor-pointer',
          open
            ? 'bg-accent-dim text-accent'
            : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
        ].join(' ')}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M10 1v2M10 17v2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M1 10h2M17 10h2M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-76 rounded-lg border border-bg-border bg-white shadow-popover p-4 flex flex-col gap-3 min-w-[300px]">
          <div className="flex items-center gap-2 mb-1">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-accent">
              <path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 1v2M10 17v2M3.22 3.22l1.42 1.42M15.36 15.36l1.42 1.42M1 10h2M17 10h2M3.22 16.78l1.42-1.42M15.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-sm font-medium text-text-primary">Ollama settings</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Base URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              spellCheck={false}
              className="bg-white border border-bg-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-secondary">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              spellCheck={false}
              className="bg-white border border-bg-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150"
            />
          </div>

          {isMixedContent && (
            <div className="rounded border border-danger/30 bg-danger-dim px-3 py-2">
              <p className="text-xs text-danger leading-relaxed">
                Page is on HTTPS but Ollama URL is HTTP — the browser will block it.
                Run <code className="font-mono bg-white/60 px-1 rounded">ngrok http 11434</code> and use the HTTPS URL here.
              </p>
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full py-2 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors duration-150 cursor-pointer shadow-btn hover:shadow-btn-hover"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
