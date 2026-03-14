'use client';

import { motion } from 'framer-motion';

const items = [
  { title: 'Fast Delivery', desc: 'Quick delivery to your doorstep' },
  { title: 'Secure Payments', desc: 'Safe payment options' },
  { title: 'Fresh Ingredients', desc: 'Quality ingredients' },
  { title: '24/7 Support', desc: 'We are here when you need us' }
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-muted/20 py-12 md:py-16">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex flex-col items-center rounded-xl border border-border/80 bg-card p-6 text-center shadow-sm hover:shadow-md"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
