"use client";
import { motion } from "motion/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MotionDiv({ children, className, initial, animate, transition }: { className: string, children: React.ReactNode, initial?: any, animate?: any, transition?: any }) {
  return (
    <motion.div animate={animate} initial={initial} transition={transition} className={className}>
      {children}
    </motion.div>
  );
}
