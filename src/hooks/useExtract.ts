import { useState } from 'react';
import { ocrImage } from '../lib/ocr';
import { parseEventsFromText } from '../lib/ollama';
import type { EventCardState } from '../lib/types';
import type { Settings } from './useSettings';

type ExtractState =
  | { phase: 'idle' }
  | { phase: 'loading'; step: 'ocr'; progress: number }
  | { phase: 'loading'; step: 'parsing' }
  | { phase: 'error'; message: string }
  | { phase: 'done' };

export interface DebugInfo {
  ocrText: string;
  promptText: string;
  rawResponse: string;
}

export function useExtract() {
  const [state, setState] = useState<ExtractState>({ phase: 'idle' });
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  async function run(
    file: File,
    settings: Settings,
    onSuccess: (cards: EventCardState[]) => void,
  ) {
    setState({ phase: 'loading', step: 'ocr', progress: 0 });
    setDebugInfo(null);
    try {
      // Step 1: OCR — extract raw text from the image locally
      const ocrText = await ocrImage(file, (pct) => {
        setState({ phase: 'loading', step: 'ocr', progress: pct });
      });

      if (!ocrText.trim()) {
        setState({ phase: 'error', message: 'No text found in the screenshot.' });
        return;
      }

      // Step 2: Ollama — apply common sense to the raw OCR text
      setState({ phase: 'loading', step: 'parsing' });
      const { events, promptText, rawResponse } = await parseEventsFromText(
        ocrText,
        settings.ollamaUrl,
        settings.model,
      );

      setDebugInfo({ ocrText, promptText, rawResponse });

      if (events.length === 0) {
        setState({ phase: 'error', message: 'No events found. Try a screenshot with visible dates.' });
        return;
      }

      const cards: EventCardState[] = events.map((e) => ({
        ...e,
        checked: true,
        status: 'idle',
      }));
      onSuccess(cards);
      setState({ phase: 'done' });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error && err.message === 'parse_failed'
        ? "Couldn't parse events. Try a clearer screenshot."
        : 'Extraction failed. Make sure Ollama is running (ollama serve).';
      setState({ phase: 'error', message: msg });
    }
  }

  function reset() {
    setState({ phase: 'idle' });
    setDebugInfo(null);
  }

  return { state, run, reset, debugInfo };
}
