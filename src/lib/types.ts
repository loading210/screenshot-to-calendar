export interface ExtractedEvent {
  id: string;           // uuid, generated client-side after extraction
  title: string;
  date: string;         // YYYY-MM-DD
  startTime: string | null;  // HH:MM (24h)
  endTime: string | null;
  description: string | null;
}

export type CardStatus = 'idle' | 'adding' | 'success' | 'error';

export interface EventCardState extends ExtractedEvent {
  checked: boolean;
  status: CardStatus;
}

export type AppStep = 'upload' | 'extract' | 'review' | 'done';
