"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

let hasMounted = false;

/**
 * Soft fade between pages on client navigation. Opacity only (no transforms),
 * so fixed elements and pinned sections inside keep working. The first page
 * load renders without it, so content is visible immediately.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  // read once per mount (template.tsx remounts this on every navigation)
  const [afterFirstLoad] = useState(() => hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);
  const animateIn = afterFirstLoad && !reduce;
  return (
    <motion.div initial={animateIn ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
