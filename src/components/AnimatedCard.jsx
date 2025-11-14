// src/components/AnimatedCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { spring } from "../animations/motionConfig";

export default function AnimatedCard({ children, className = "", delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(2,6,23,0.06)" }}
      className={`rounded-xl p-4 bg-white/5 ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}
