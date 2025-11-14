// src/components/AnimatedModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../animations/motionConfig";

export default function AnimatedModal({ open, title = "Confirm", message = "", onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
  const reduce = usePrefersReducedMotion();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      <motion.div
        initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
        animate={reduce ? {} : { opacity: 1, scale: 1 }}
        exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-white border">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-emerald-600 text-white">
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
