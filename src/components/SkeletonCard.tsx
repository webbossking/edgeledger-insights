export function SkeletonCard() {
  return (
    <div className="card-elevated p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-48" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 bg-muted rounded-full w-16" />
            <div className="h-5 bg-muted rounded w-20" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-14" />
        </div>
      </div>
      <div className="mt-3 flex gap-4">
        <div className="h-3 bg-muted rounded w-24" />
        <div className="h-3 bg-muted rounded w-20" />
        <div className="h-3 bg-muted rounded w-16" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="card-elevated p-4 animate-pulse">
      <div className="h-3 bg-muted rounded w-20 mb-2" />
      <div className="h-7 bg-muted rounded w-16" />
    </div>
  );
}
