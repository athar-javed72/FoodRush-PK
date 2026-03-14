'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const links = [
  { label: 'Menu', href: '/menu' },
  { label: 'Cart', href: '/cart' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' }
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              FoodRush PK
            </h3>
            <p className="text-sm text-muted-foreground">
              Fresh food delivered fast across Pakistan.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick links
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <p className="text-sm text-muted-foreground">support@foodrush.pk</p>
          </motion.div>
        </div>
        <div className="mt-10 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FoodRush PK.
        </div>
      </div>
    </footer>
  );
}
