import { createWorker } from 'tesseract.js';

/**
 * Pre-processes the image before OCR:
 * 1. Scales up 2x — more pixels = better Tesseract accuracy
 * 2. Converts to grayscale
 * 3. Applies a binary threshold at 200 — this turns coloured backgrounds
 *    (red, orange, teal, etc.) black while keeping white text white, AND
 *    keeps white backgrounds white with black text black.
 */
async function preprocessImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;

      // Draw scaled-up image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        // Grayscale (luminance-weighted)
        const gray = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        // Binary threshold at 200:
        //   - White/near-white pixels (backgrounds, white text) → 255
        //   - Everything else (coloured boxes, dark text) → 0
        const val = gray > 200 ? 255 : 0;
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
        // alpha unchanged
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    };

    img.onerror = reject;
    img.src = url;
  });
}

export async function ocrImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const processed = await preprocessImage(file);

  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  const { data } = await worker.recognize(processed);
  await worker.terminate();

  return data.text;
}
