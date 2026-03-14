'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/app/store';
import { Button } from '@/components/ui/button';

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (user === null) router.replace('/login');
    else if (user && user.role !== 'driver') router.replace('/');
  }, [user, router]);

  if (!user || user.role !== 'driver') {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/driver/dashboard" className="font-semibold">FoodRush Driver</Link>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>Exit</Button>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}
