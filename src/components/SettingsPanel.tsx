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

  // Sync local state when settings change externally
  useEffect(() => {
    setUrl(settings.ollamaUrl);
    setModel(settings.model);
  }, [settings]);

  // Close on click outside
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
      {/* Gear button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        className={[
          'flex items-center justify-center w-8 h-8 rounded-[8px] border transition-colors duration-150',
          open
            ? 'border-accent text-accent bg-accent-dim'
            : 'border-bg-border text-text-tertiary hover:text-text-secondary hover:border-text-tertiary',
        ].join(' ')}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 4h12M1 10h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="4.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="#0A0A0B"/>
          <circle cx="9.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.2" fill="#0A0A0B"/>
        </svg>
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-[10px] border border-bg-border bg-bg-surface shadow-lg p-4 flex flex-col gap-3">
          <p className="text-xs font-mono text-text-tertiary mb-1">Ollama settings</p>

          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-sans">Base URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              spellCheck={false}
              className="bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
            />
          </div>

          {/* Model */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary font-sans">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              spellCheck={false}
              className="bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent transition-colors duration-150"
            />
          </div>

          {/* Mixed-content warning */}
          {isMixedContent && (
            <div className="rounded-[6px] border border-danger/30 bg-danger-dim px-3 py-2">
              <p className="text-xs text-danger font-sans leading-relaxed">
                This page is on HTTPS but your Ollama URL is HTTP. Browsers will block the request.
                Expose Ollama over HTTPS (e.g.{' '}
                <code className="font-mono">ngrok http 11434</code>) and update this URL.
              </p>
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-1.5 rounded-[6px] bg-accent hover:bg-accent-hover text-white text-xs font-sans font-medium transition-colors duration-150"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
