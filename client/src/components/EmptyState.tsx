import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card px-6 py-10 text-center text-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="max-w-md text-xs text-muted-foreground">{message}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="mt-2">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

