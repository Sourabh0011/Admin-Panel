// src/components/AnimatedSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar"; // your existing Sidebar component
import { usePrefersReducedMotion } from "../animations/motionConfig";

const panelVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function AnimatedSidebar({ open, onClose, active, onNav }) {
  const reduce = usePrefersReducedMotion();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={reduce ? {} : panelVariants}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative w-72 h-full p-4"
      >
        <Sidebar active={active} onNav={(r) => { onNav(r); onClose(); }} />
      </motion.div>
    </div>
  );
}
