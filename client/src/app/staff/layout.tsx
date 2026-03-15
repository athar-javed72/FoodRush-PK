'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppSelector } from '@/app/store';
import { isStaffRole } from '@/lib/roles';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (user === null) router.replace('/login?returnUrl=/staff/dashboard');
    else if (user && !isStaffRole(user.role)) router.replace('/');
  }, [user, router]);

  if (!user || !isStaffRole(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container py-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/staff/dashboard" className="font-medium text-foreground hover:underline">
            Staff Hub
          </Link>
        </div>
        {children}
      </main>
    </>
  );
}
