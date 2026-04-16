import { useState } from 'react';
import type { DebugInfo } from '../hooks/useExtract';

interface Props {
  debug: DebugInfo;
}

type Tab = 'ocr' | 'prompt' | 'response';

export function DebugPanel({ debug }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('ocr');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'ocr',      label: 'OCR text' },
    { id: 'prompt',   label: 'Prompt' },
    { id: 'response', label: 'Raw response' },
  ];

  const content = tab === 'ocr' ? debug.ocrText
    : tab === 'prompt' ? debug.promptText
    : debug.rawResponse;

  return (
    <div className="mt-6 rounded-lg border border-bg-border bg-white shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-bg-elevated transition-colors duration-150 cursor-pointer"
      >
        <span className="text-xs font-mono text-text-tertiary tracking-wide">debug</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-text-tertiary transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-bg-border">
          <div className="flex border-b border-bg-border bg-bg-elevated">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'px-4 py-2 text-xs font-mono transition-colors duration-150 cursor-pointer',
                  tab === t.id
                    ? 'text-accent border-b-2 border-accent -mb-px bg-white font-medium'
                    : 'text-text-secondary hover:text-text-primary',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <pre className="p-4 text-xs font-mono text-text-secondary bg-bg-base overflow-x-auto whitespace-pre-wrap break-words max-h-72 overflow-y-auto leading-relaxed">
            {content || <span className="text-text-tertiary italic">empty</span>}
          </pre>
        </div>
      )}
    </div>
  );
}
