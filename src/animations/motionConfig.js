// src/animations/motionConfig.js
import { useReducedMotion } from "framer-motion";

export const spring = { type: "spring", stiffness: 320, damping: 28 };

export function usePrefersReducedMotion() {
  // returns boolean
  return useReducedMotion();
}

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

export const pageTransition = {
  duration: 0.36,
  ease: [0.2, 0.8, 0.2, 1],
};
