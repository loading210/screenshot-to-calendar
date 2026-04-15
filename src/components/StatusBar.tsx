import type { AppStep } from '../lib/types';

const STEPS: { key: AppStep; label: string; num: number }[] = [
  { key: 'upload',  label: 'Upload',  num: 1 },
  { key: 'extract', label: 'Extract', num: 2 },
  { key: 'review',  label: 'Review',  num: 3 },
  { key: 'done',    label: 'Done',    num: 4 },
];

const ORDER: AppStep[] = ['upload', 'extract', 'review', 'done'];

interface Props {
  current: AppStep;
}

export function StatusBar({ current }: Props) {
  const currentIdx = ORDER.indexOf(current);

  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const stepIdx = ORDER.indexOf(step.key);
        const isComplete = stepIdx < currentIdx;
        const isActive   = stepIdx === currentIdx;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-150',
                isComplete
                  ? 'border-success/30 text-success bg-success-dim'
                  : isActive
                  ? 'border-accent text-accent bg-accent-dim'
                  : 'border-bg-border text-text-tertiary bg-transparent',
              ].join(' ')}
            >
              {isComplete ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{step.num}</span>
              )}
              {step.label}
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-bg-border mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}
