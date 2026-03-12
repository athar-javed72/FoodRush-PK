import Link from 'next/link';
import { Header } from '@/components/header';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/analytics', label: 'Analytics' }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        </aside>

        <section className="flex-1 space-y-6">
          {children}
        </section>
      </main>
    </>
  );
}

