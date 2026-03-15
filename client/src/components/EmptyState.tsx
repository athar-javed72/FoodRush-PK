import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-8 py-14 text-center shadow-sm">
      {icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/60 text-4xl text-muted-foreground" aria-hidden>
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="default" className="mt-2">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

