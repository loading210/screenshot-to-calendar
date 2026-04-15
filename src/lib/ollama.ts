import { v4 as uuidv4 } from 'uuid';
import type { ExtractedEvent } from './types';

const SYSTEM_PROMPT = `You are an event extraction assistant.
The user will send you raw text that was OCR'd from a screenshot.
Extract every date, event, appointment, deadline, or time-sensitive item in the text.
Use common sense to infer event titles from surrounding context — e.g. if a line says
"Team standup" and the next line says "Mon 9am", combine them correctly.

Today's date for resolving ambiguous relative dates (like "Monday" or "next week"):
{{TODAY}}

Return ONLY a valid JSON array. No markdown fences, no explanation, no extra text. Format:
[
  {
    "title": "string — concise event name",
    "date": "YYYY-MM-DD",
    "startTime": "HH:MM or null",
    "endTime": "HH:MM or null",
    "description": "any extra context, or null"
  }
]

If no events are found, return an empty array: []
If a year is ambiguous, assume the nearest future occurrence.
Convert all times to 24-hour format.`;

export interface OllamaResult {
  events: ExtractedEvent[];
  promptText: string;
  rawResponse: string;
}

export async function parseEventsFromText(
  text: string,
  ollamaUrl: string,
  model: string,
): Promise<OllamaResult> {
  const today = new Date().toISOString().split('T')[0];
  const systemPrompt = SYSTEM_PROMPT.replace('{{TODAY}}', today);
  const promptText = `[system]\n${systemPrompt}\n\n[user]\n${text}`;

  const chatUrl = ollamaUrl.replace(/\/+$/, '') + '/api/chat';

  const response = await fetch(chatUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const rawResponse: string = data.message?.content ?? '';

  // Strip markdown code fences if the model wraps output in them
  const cleaned = rawResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed: Omit<ExtractedEvent, 'id'>[];
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('parse_failed');
  }

  return {
    events: parsed.map((e) => ({ ...e, id: uuidv4() })),
    promptText,
    rawResponse,
  };
}
