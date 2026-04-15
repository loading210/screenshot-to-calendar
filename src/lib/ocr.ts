import { createWorker } from 'tesseract.js';

/**
 * Pre-processes the image before OCR:
 * 1. Scales up 2x — more pixels = better Tesseract accuracy
 * 2. Grayscale + contrast(1.4) via canvas CSS filter (GPU-accelerated)
 *    - Darkens coloured backgrounds (red/orange/teal time blocks) enough
 *      that white text inside them has readable contrast
 *    - Brightens near-white areas (page background, white text)
 *    - Unlike binary threshold, this stays analogue so photo noise
 *      (marble texture, shadows) stays near-white and is ignored by
 *      Tesseract rather than being turned solid-black and misread.
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

      // Apply grayscale + moderate contrast in one GPU-accelerated pass
      ctx.filter = 'grayscale(1) contrast(1.4)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);
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
