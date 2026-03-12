"use client";

import { motion } from "framer-motion";

interface FadeInProps {
  delay?: number;
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function FadeIn({ delay = 0, className, children, id }: FadeInProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
