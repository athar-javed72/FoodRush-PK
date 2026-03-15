'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
