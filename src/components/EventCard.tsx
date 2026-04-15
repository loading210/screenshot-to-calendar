import { useState } from 'react';
import type { EventCardState } from '../lib/types';

interface Props {
  card: EventCardState;
  index: number;
  onChange: (id: string, patch: Partial<EventCardState>) => void;
  onRemove: (id: string) => void;
}

export function EventCard({ card, index, onChange, onRemove }: Props) {
  const [notesOpen, setNotesOpen] = useState(!!card.description);

  const animDelay = `${index * 60}ms`;

  return (
    <div
      className={[
        'card-enter rounded-[10px] border border-bg-border bg-bg-surface p-4 transition-opacity duration-150',
        !card.checked ? 'opacity-45' : '',
      ].join(' ')}
      style={{ animationDelay: animDelay }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={card.checked}
            onChange={(e) => onChange(card.id, { checked: e.target.checked })}
            className="w-4 h-4 rounded accent-[#5B6EF5] cursor-pointer"
          />
        </div>

        {/* Fields */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Title */}
          <input
            type="text"
            value={card.title}
            onChange={(e) => onChange(card.id, { title: e.target.value })}
            placeholder="Event title"
            className={[
              'w-full bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-sm font-sans font-medium text-text-primary placeholder-text-tertiary',
              'focus:outline-none focus:border-accent transition-colors duration-150',
              !card.checked ? 'line-through' : '',
            ].join(' ')}
          />

          {/* Date + Time row */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="date"
              value={card.date}
              onChange={(e) => onChange(card.id, { date: e.target.value })}
              className="bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent transition-colors duration-150"
            />
            <input
              type="time"
              value={card.startTime ?? ''}
              onChange={(e) =>
                onChange(card.id, { startTime: e.target.value || null })
              }
              placeholder="Start"
              className="bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent transition-colors duration-150 w-32"
            />
            <span className="text-text-tertiary text-xs">→</span>
            <input
              type="time"
              value={card.endTime ?? ''}
              onChange={(e) =>
                onChange(card.id, { endTime: e.target.value || null })
              }
              placeholder="End"
              className="bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent transition-colors duration-150 w-32"
            />
          </div>

          {/* Notes toggle */}
          {!notesOpen ? (
            <button
              onClick={() => setNotesOpen(true)}
              className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-150 text-left font-sans"
            >
              Add notes ↓
            </button>
          ) : (
            <textarea
              value={card.description ?? ''}
              onChange={(e) =>
                onChange(card.id, { description: e.target.value || null })
              }
              placeholder="Notes / description…"
              rows={2}
              className="w-full bg-bg-elevated border border-bg-border rounded-[6px] px-3 py-1.5 text-xs font-sans text-text-secondary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-150 resize-none"
            />
          )}
        </div>

        {/* Right side: status + trash */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-1">
          {/* Status */}
          <div className="h-5 flex items-center">
            {card.status === 'adding' && <span className="spinner" />}
            {card.status === 'success' && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                <span className="text-xs text-success font-sans">Added</span>
              </div>
            )}
            {card.status === 'error' && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                <button
                  onClick={() => onChange(card.id, { status: 'idle' })}
                  className="text-xs text-danger font-sans hover:underline"
                >
                  Failed — retry
                </button>
              </div>
            )}
          </div>

          {/* Trash */}
          <button
            onClick={() => onRemove(card.id)}
            className="text-text-tertiary hover:text-danger transition-colors duration-150"
            aria-label="Remove event"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M3 3.5l.5 8a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5l.5-8"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
