import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: number | string;
  description?: string;
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}
