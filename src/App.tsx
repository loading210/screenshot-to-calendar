import { useState, useMemo } from 'react';
import { DropZone } from './components/DropZone';
import { EventList } from './components/EventList';
import { StatusBar } from './components/StatusBar';
import { AuthButton } from './components/AuthButton';
import { SkeletonCard } from './components/SkeletonCard';
import { DebugPanel } from './components/DebugPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { useExtract } from './hooks/useExtract';
import { useCalendar } from './hooks/useCalendar';
import { useSettings } from './hooks/useSettings';
import type { AppStep, EventCardState } from './lib/types';
import './index.css';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [cards, setCards] = useState<EventCardState[]>([]);

  const { state: extractState, run: runExtract, reset: resetExtract, debugInfo } = useExtract();
  const { token, login, logout, addEvents, adding } = useCalendar();
  const { settings, save: saveSettings } = useSettings();

  // Derived step
  const step = useMemo<AppStep>(() => {
    if (cards.length > 0) {
      const allDone = cards.every(
        (c) => !c.checked || c.status === 'success'
      );
      if (allDone && cards.some((c) => c.status === 'success')) return 'done';
      return 'review';
    }
    if (extractState.phase === 'loading' || extractState.phase === 'done') {
      return 'extract';
    }
    return 'upload';
  }, [cards, extractState.phase]);

  function handleFile(f: File) {
    setFile(f);
    setCards([]);
    resetExtract();
  }

  function handleClear() {
    setFile(null);
    setCards([]);
    resetExtract();
  }

  function handleCardChange(id: string, patch: Partial<EventCardState>) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function handleCardRemove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleExtract() {
    if (!file) return;
    await runExtract(file, settings, (newCards) => setCards(newCards));
  }

  async function handleAddToCalendar() {
    if (!token) {
      await login();
      return;
    }
    await addEvents(cards, (id, status) => handleCardChange(id, { status }));
  }

  // Checked card counts
  const checkedCards = cards.filter((c) => c.checked);
  const successCount = checkedCards.filter((c) => c.status === 'success').length;
  const errorCount   = checkedCards.filter((c) => c.status === 'error').length;
  const pendingCount = checkedCards.filter((c) => c.status === 'idle').length;

  // CTA label
  function ctaLabel() {
    if (adding) return 'Adding events…';
    if (successCount > 0 && pendingCount === 0 && errorCount === 0) {
      return `✓ All events added`;
    }
    if (errorCount > 0 && pendingCount === 0) {
      return `${successCount} of ${checkedCards.length} added — retry failed`;
    }
    return `Add ${checkedCards.length} event${checkedCards.length !== 1 ? 's' : ''} to Google Calendar`;
  }

  const showCards = cards.length > 0;
  const showSkeleton = extractState.phase === 'loading';

  return (
    <div className="min-h-screen bg-bg-base font-sans">
      {/* Header */}
      <header className="h-14 border-b border-bg-border flex items-center px-4">
        <div className="max-w-[680px] w-full mx-auto flex items-center justify-between">
          <span className="font-mono text-sm text-text-primary tracking-tight">
            screenshot → calendar
          </span>
          <div className="flex items-center gap-2">
            <SettingsPanel settings={settings} onSave={saveSettings} />
            <AuthButton token={token} onLogin={login} onLogout={logout} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[680px] mx-auto px-4 py-6">
        <StatusBar current={step} />

        {/* Drop zone */}
        <div className="mb-4">
          <DropZone file={file} onFile={handleFile} onClear={handleClear} />
        </div>

        {/* Extract button */}
        <button
          disabled={!file || extractState.phase === 'loading'}
          onClick={handleExtract}
          className={[
            'w-full py-2.5 rounded-[10px] text-sm font-sans font-medium transition-all duration-150 mb-6',
            !file || extractState.phase === 'loading'
              ? 'bg-bg-elevated text-text-tertiary cursor-not-allowed border border-bg-border'
              : 'bg-accent hover:bg-accent-hover text-white cursor-pointer border border-transparent',
          ].join(' ')}
        >
          {extractState.phase === 'loading'
            ? extractState.step === 'ocr'
              ? `Reading text… ${extractState.progress > 0 ? `${extractState.progress}%` : ''}`
              : 'Understanding events…'
            : 'Extract events'}
        </button>

        {/* Extraction error */}
        {extractState.phase === 'error' && (
          <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-[10px] border border-danger/30 bg-danger-dim">
            <p className="text-sm text-danger font-sans">{extractState.message}</p>
            <button
              onClick={handleExtract}
              className="text-xs text-danger underline ml-4 font-sans flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeletons while loading */}
        {showSkeleton && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-bg-border" />
              <span className="text-xs text-text-tertiary font-mono">
                {extractState.phase === 'loading' && extractState.step === 'parsing'
                  ? 'Understanding events…'
                  : `Reading text…${extractState.phase === 'loading' && extractState.step === 'ocr' && extractState.progress > 0 ? ` ${extractState.progress}%` : ''}`}
              </span>
              <div className="h-px flex-1 bg-bg-border" />
            </div>
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} index={i} />
            ))}
          </div>
        )}

        {/* Event list */}
        {showCards && (
          <>
            <EventList
              cards={cards}
              onChange={handleCardChange}
              onRemove={handleCardRemove}
            />

            {/* Add to Calendar CTA */}
            {checkedCards.length > 0 && (
              <button
                disabled={adding || (successCount > 0 && pendingCount === 0 && errorCount === 0)}
                onClick={handleAddToCalendar}
                className={[
                  'mt-6 w-full py-2.5 rounded-[10px] text-sm font-sans font-medium transition-all duration-150 flex items-center justify-center gap-2',
                  adding
                    ? 'bg-accent-dim text-accent border border-accent/30 cursor-not-allowed'
                    : successCount > 0 && pendingCount === 0 && errorCount === 0
                    ? 'bg-success-dim text-success border border-success/30 cursor-default'
                    : !token
                    ? 'bg-bg-elevated border border-bg-border text-text-secondary hover:border-accent hover:text-accent cursor-pointer'
                    : 'bg-accent hover:bg-accent-hover text-white border border-transparent cursor-pointer',
                ].join(' ')}
              >
                {adding && <span className="spinner" />}
                {!token && checkedCards.length > 0 && pendingCount > 0
                  ? 'Sign in to add to Google Calendar'
                  : ctaLabel()}
              </button>
            )}
          </>
        )}

        {/* Debug panel — shown after any extraction attempt */}
        {debugInfo && <DebugPanel debug={debugInfo} />}
      </main>
    </div>
  );
}
