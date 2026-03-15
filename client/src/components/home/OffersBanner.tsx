'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function OffersBanner() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-12 md:py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-6 py-10 text-primary-foreground shadow-card md:px-12 md:py-14">
          <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Get 20% Off on Your First Order</h2>
              <p className="mt-2 text-sm opacity-90">Use code: <strong>FOOD20</strong></p>
            </div>
            <Link href="/menu" className="mt-4 md:mt-0">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">Order now</Button>
            </Link>
          </div>
          <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </motion.section>
  );
}
