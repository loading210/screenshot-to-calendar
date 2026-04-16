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

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function onDragLeave() { setDragging(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  if (file) {
    const previewUrl = URL.createObjectURL(file);
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-bg-border bg-white shadow-card">
        <img
          src={previewUrl}
          alt="preview"
          className="h-10 w-14 object-cover rounded border border-bg-border flex-shrink-0"
        />
        <span className="text-sm text-text-secondary truncate flex-1">{file.name}</span>
        <button
          onClick={onClear}
          className="text-sm text-accent hover:text-accent-hover transition-colors duration-150 font-medium ml-2 flex-shrink-0 cursor-pointer"
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
          'flex flex-col items-center justify-center gap-3 min-h-[200px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-150 select-none',
          dragging
            ? 'border-accent bg-accent-dim'
            : 'border-bg-border bg-white hover:border-accent hover:bg-accent-dim/30',
        ].join(' ')}
      >
        {/* Upload icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragging ? 'bg-accent-dim' : 'bg-bg-elevated'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={dragging ? 'text-accent' : 'text-text-secondary'}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            Drop a screenshot here
          </p>
          <p className="text-xs text-text-secondary mt-1">
            or <span className="text-accent">browse</span> — PNG, JPG, WEBP up to 10 MB
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
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
