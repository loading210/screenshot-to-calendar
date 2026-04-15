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
    <div className="mt-6 rounded-[10px] border border-bg-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-bg-surface hover:bg-bg-elevated transition-colors duration-150"
      >
        <span className="text-xs font-mono text-text-tertiary">debug</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`text-text-tertiary transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-bg-border">
          {/* Tabs */}
          <div className="flex border-b border-bg-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'px-4 py-2 text-xs font-mono transition-colors duration-150',
                  tab === t.id
                    ? 'text-text-primary border-b border-accent -mb-px bg-bg-surface'
                    : 'text-text-tertiary hover:text-text-secondary',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <pre className="p-4 text-xs font-mono text-text-secondary bg-bg-base overflow-x-auto whitespace-pre-wrap break-words max-h-72 overflow-y-auto leading-relaxed">
            {content || <span className="text-text-tertiary italic">empty</span>}
          </pre>
        </div>
      )}
    </div>
  );
}
