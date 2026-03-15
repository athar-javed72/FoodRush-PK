'use client';

import { motion } from 'framer-motion';

const items = [
  { title: 'Fast Delivery', desc: 'Quick delivery to your doorstep', icon: '🚀' },
  { title: 'Secure Payments', desc: 'Safe payment options', icon: '🔒' },
  { title: 'Fresh Ingredients', desc: 'Quality ingredients', icon: '🥗' },
  { title: '24/7 Support', desc: 'We are here when you need us', icon: '💬' }
];

export function TrustSection() {
  return (
    <section className="relative border-y border-border/80 bg-muted/30 dark:bg-muted/10 py-14 md:py-20">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center rounded-2xl border border-border/60 bg-card/80 dark:bg-card/60 backdrop-blur-sm p-8 text-center shadow-elevated hover:shadow-card transition-all duration-300"
            >
              <span className="text-3xl mb-3" aria-hidden>{item.icon}</span>
              <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
