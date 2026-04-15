interface Props {
  index: number;
}

export function SkeletonCard({ index }: Props) {
  return (
    <div
      className="skeleton rounded-[10px] border border-bg-border bg-bg-surface p-4"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 rounded bg-bg-elevated mt-0.5 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-7 bg-bg-elevated rounded-[6px] w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-bg-elevated rounded-[6px] w-32" />
            <div className="h-6 bg-bg-elevated rounded-[6px] w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
