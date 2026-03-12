"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type * as React from "react";

interface MotionCardProps extends React.ComponentProps<typeof Card> {
  delay?: number;
}

export function MotionCard({ delay = 0, children, ...props }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.25, ease: "easeOut", delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}

