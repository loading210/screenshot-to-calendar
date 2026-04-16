import { useState } from 'react';
import type { EventCardState } from '../lib/types';

interface Props {
  card: EventCardState;
  index: number;
  onChange: (id: string, patch: Partial<EventCardState>) => void;
  onRemove: (id: string) => void;
}

// Google Calendar event colors — cycles through for visual variety
const ACCENT_COLORS = [
  '#4285F4', '#EA4335', '#FBBC04', '#34A853',
  '#FF6D00', '#46BDC6', '#7986CB', '#8E24AA',
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDisplayTime(time: string | null): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export function EventCard({ card, index, onChange, onRemove }: Props) {
  const [notesOpen, setNotesOpen] = useState(!!card.description);
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const animDelay = `${index * 60}ms`;

  return (
    <div
      className={[
        'card-enter bg-white rounded-lg shadow-card overflow-hidden transition-all duration-150',
        !card.checked ? 'opacity-50' : 'hover:shadow-card-hover',
      ].join(' ')}
      style={{ animationDelay: animDelay }}
    >
      <div className="flex">
        {/* Colored left bar — signature GCal look */}
        <div className="w-1 flex-shrink-0" style={{ backgroundColor: color }} />

        <div className="flex-1 px-4 py-3">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={card.checked}
              onChange={(e) => onChange(card.id, { checked: e.target.checked })}
              className="mt-1 w-4 h-4 cursor-pointer accent-accent flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* Title */}
              <input
                type="text"
                value={card.title}
                onChange={(e) => onChange(card.id, { title: e.target.value })}
                placeholder="Event title"
                className={[
                  'w-full bg-transparent text-sm font-medium text-text-primary placeholder-text-tertiary',
                  'border-b border-transparent focus:border-accent focus:outline-none transition-colors duration-150 pb-0.5',
                  !card.checked ? 'line-through text-text-secondary' : '',
                ].join(' ')}
              />

              {/* Date + time chips */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 1v3M11 1v3M1 7h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span className="text-text-tertiary text-xs">{formatDisplayDate(card.date)}</span>
                </div>
                <input
                  type="date"
                  value={card.date}
                  onChange={(e) => onChange(card.id, { date: e.target.value })}
                  className="text-xs text-accent bg-accent-dim border-0 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                />
                <input
                  type="time"
                  value={card.startTime ?? ''}
                  onChange={(e) => onChange(card.id, { startTime: e.target.value || null })}
                  placeholder="Start"
                  className="text-xs text-text-secondary bg-bg-elevated border border-bg-border rounded px-2 py-0.5 focus:outline-none focus:border-accent transition-colors duration-150 w-28"
                />
                {(card.startTime || card.endTime) && (
                  <span className="text-text-tertiary text-xs">→</span>
                )}
                <input
                  type="time"
                  value={card.endTime ?? ''}
                  onChange={(e) => onChange(card.id, { endTime: e.target.value || null })}
                  placeholder="End"
                  className="text-xs text-text-secondary bg-bg-elevated border border-bg-border rounded px-2 py-0.5 focus:outline-none focus:border-accent transition-colors duration-150 w-28"
                />
                {/* Human-readable time */}
                {card.startTime && (
                  <span className="text-xs text-text-tertiary">
                    {formatDisplayTime(card.startTime)}
                    {card.endTime ? ` – ${formatDisplayTime(card.endTime)}` : ''}
                  </span>
                )}
              </div>

              {/* Notes */}
              {!notesOpen ? (
                <button
                  onClick={() => setNotesOpen(true)}
                  className="text-xs text-accent hover:underline transition-colors duration-150 text-left cursor-pointer"
                >
                  + Add description
                </button>
              ) : (
                <textarea
                  value={card.description ?? ''}
                  onChange={(e) => onChange(card.id, { description: e.target.value || null })}
                  placeholder="Add a description…"
                  rows={2}
                  className="w-full bg-bg-elevated border border-bg-border rounded px-3 py-1.5 text-xs text-text-secondary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-150 resize-none"
                />
              )}
            </div>

            {/* Right: status + remove */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              {/* Status indicator */}
              <div className="h-5 flex items-center">
                {card.status === 'adding' && <span className="spinner" />}
                {card.status === 'success' && (
                  <div className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" fill="#34A853"/>
                      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs text-success font-medium">Added</span>
                  </div>
                )}
                {card.status === 'error' && (
                  <button
                    onClick={() => onChange(card.id, { status: 'idle' })}
                    className="flex items-center gap-1 text-xs text-danger hover:underline cursor-pointer"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#EA4335" strokeWidth="1.5"/>
                      <path d="M8 5v3M8 10.5v.5" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Retry
                  </button>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemove(card.id)}
                aria-label="Remove event"
                className="text-text-tertiary hover:text-danger transition-colors duration-150 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M6.5 4V3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M4 4l.5 9a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
