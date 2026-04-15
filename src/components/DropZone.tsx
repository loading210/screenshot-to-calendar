import { useRef, useState } from 'react';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_BYTES = 10 * 1024 * 1024;

interface Props {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}

export function DropZone({ file, onFile, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!ACCEPTED.includes(f.type)) {
      setError('Unsupported file type. Use PNG, JPG, or WEBP.');
      return;
    }
    if (f.size > MAX_BYTES) {
      setError('File exceeds 10 MB limit.');
      return;
    }
    onFile(f);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  if (file) {
    const previewUrl = URL.createObjectURL(file);
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-[10px] border border-bg-border bg-bg-surface">
        <img
          src={previewUrl}
          alt="preview"
          className="h-10 w-14 object-cover rounded-[6px] border border-bg-border flex-shrink-0"
        />
        <span className="text-sm text-text-secondary font-sans truncate flex-1">
          {file.name}
        </span>
        <button
          onClick={onClear}
          className="text-xs text-text-tertiary hover:text-text-secondary transition-colors duration-150 font-sans ml-2 flex-shrink-0"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          'flex flex-col items-center justify-center gap-2 min-h-[220px] rounded-[10px] border border-dashed cursor-pointer transition-all duration-150 select-none',
          dragging
            ? 'border-accent bg-accent-dim'
            : 'border-bg-border bg-bg-surface hover:border-text-tertiary',
        ].join(' ')}
      >
        {/* Upload icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          className={dragging ? 'text-accent' : 'text-text-tertiary'}
        >
          <path
            d="M14 18V10M14 10l-3 3M14 10l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22h10a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4h-.5M5 16a4 4 0 0 1-1-2.7C4 11 5.8 9 8.2 9c.3-2.8 2.7-5 5.8-5 3.3 0 6 2.7 6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm font-sans text-text-primary">
          Drop a screenshot here
        </p>
        <p className="text-xs font-sans text-text-tertiary">
          or click to upload — PNG, JPG, WEBP
        </p>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger font-sans">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
