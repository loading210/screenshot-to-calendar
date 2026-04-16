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
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, i) => {
        const stepIdx   = ORDER.indexOf(step.key);
        const isComplete = stepIdx < currentIdx;
        const isActive   = stepIdx === currentIdx;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                  isComplete
                    ? 'bg-success text-white'
                    : isActive
                    ? 'bg-accent text-white shadow-btn'
                    : 'bg-bg-border text-text-tertiary',
                ].join(' ')}
              >
                {isComplete ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{step.num}</span>
                )}
              </div>
              <span
                className={[
                  'text-xs font-medium whitespace-nowrap',
                  isActive   ? 'text-accent'         :
                  isComplete ? 'text-success'         :
                               'text-text-tertiary',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={[
                  'w-16 h-0.5 mx-2 mb-5 transition-colors duration-200',
                  stepIdx < currentIdx ? 'bg-success' : 'bg-bg-border',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
