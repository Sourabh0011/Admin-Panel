// src/components/MotionWrapper.jsx
import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, usePrefersReducedMotion } from "../animations/motionConfig";

/**
 * <MotionWrapper key={route}>...page content...</MotionWrapper>
 */
export default function MotionWrapper({ children, className = "" }) {
  const reduce = usePrefersReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
