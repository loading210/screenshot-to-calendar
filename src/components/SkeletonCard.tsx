interface Props {
  index: number;
}

export function SkeletonCard({ index }: Props) {
  return (
    <div
      className="skeleton bg-white rounded-lg shadow-card overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex">
        <div className="w-1 bg-bg-border flex-shrink-0" />
        <div className="flex-1 px-4 py-3 flex items-start gap-3">
          <div className="w-4 h-4 rounded bg-bg-elevated mt-1 flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-5 bg-bg-elevated rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-5 bg-bg-elevated rounded w-20" />
              <div className="h-5 bg-bg-elevated rounded w-28" />
              <div className="h-5 bg-bg-elevated rounded w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
