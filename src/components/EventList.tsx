import type { EventCardState } from '../lib/types';
import { EventCard } from './EventCard';

interface Props {
  cards: EventCardState[];
  onChange: (id: string, patch: Partial<EventCardState>) => void;
  onRemove: (id: string) => void;
}

export function EventList({ cards, onChange, onRemove }: Props) {
  if (cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 my-2">
        <div className="h-px flex-1 bg-bg-border" />
        <span className="text-xs text-text-tertiary font-medium">
          {cards.length} event{cards.length !== 1 ? 's' : ''} found
        </span>
        <div className="h-px flex-1 bg-bg-border" />
      </div>
      {cards.map((card, i) => (
        <EventCard
          key={card.id}
          card={card}
          index={i}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
