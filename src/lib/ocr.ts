import { createWorker } from 'tesseract.js';

export async function ocrImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const { data } = await worker.recognize(file);
  await worker.terminate();

  return data.text;
}
