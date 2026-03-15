'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useAppSelector } from '@/app/store';

const adminLinksAll = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/employees', label: 'Team' },
  { href: '/admin/complaints', label: 'Team concerns' },
  { href: '/admin/suggestions', label: 'Team ideas' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/analytics', label: 'Analytics' }
];

/** Manager only sees these; admin sees all */
const managerLinks = ['/admin', '/admin/employees', '/admin/complaints', '/admin/suggestions'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isAdminOrManager = isAdmin || isManager;
  const adminLinks = isAdmin
    ? adminLinksAll
    : adminLinksAll.filter((link) => managerLinks.includes(link.href));

  useEffect(() => {
    if (user === null) router.replace('/login');
    else if (user && !isAdminOrManager) router.replace('/');
  }, [user, router, isAdminOrManager]);

  if (!user || !isAdminOrManager) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="container flex gap-6 py-6">
        <aside className="hidden w-56 shrink-0 flex-col gap-2 text-sm md:flex">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Admin</p>
          <nav className="space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-[10px] text-muted-foreground">
            Built by{' '}
            <a href="https://nexoralabs.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Nexora Labs
            </a>
          </p>
        </aside>

        <section className="flex-1 space-y-6">
          {children}
        </section>
      </main>
    </>
  );
}

