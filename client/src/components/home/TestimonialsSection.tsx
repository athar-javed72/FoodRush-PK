'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ali Hassan',
    rating: 5,
    text: 'Fast delivery and food was hot and fresh. Will order again!',
    avatar: 'AH'
  },
  {
    name: 'Sara Khan',
    rating: 5,
    text: 'Best biryani in town. FoodRush never disappoints.',
    avatar: 'SK'
  },
  {
    name: 'Omar Ahmed',
    rating: 4,
    text: 'Easy ordering and quick support. Great experience.',
    avatar: 'OA'
  },
  {
    name: 'Fatima Noor',
    rating: 5,
    text: 'Love the variety and the delivery is always on time.',
    avatar: 'FN'
  }
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-border bg-muted/20 py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What customers say</h2>
          <p className="mt-1 text-muted-foreground">Real reviews from real food lovers.</p>
        </motion.div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-elevated hover:shadow-card transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 text-amber-500">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} aria-hidden>★</span>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  aria-hidden
                >
                  {t.avatar}
                </div>
                <span className="font-medium text-foreground">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
