'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function CartSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <section className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <Skeleton className="h-16 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </section>
      <aside className="space-y-3">
        <Skeleton className="h-6 w-28" />
        <div className="space-y-2 rounded-xl border bg-card p-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex justify-between pt-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="mt-4 h-10 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  );
}
