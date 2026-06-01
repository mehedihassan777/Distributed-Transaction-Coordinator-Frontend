import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function DataTableSkeleton({
  columns = 5,
  rows = 8,
}: DataTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading table">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex gap-4 bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-t border-slate-100 px-4 py-3 dark:border-slate-700/50"
          >
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}
