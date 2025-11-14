// src/components/Skeleton.jsx
import React from "react";

export default function Skeleton({ width = "100%", height = 16, rounded = false, className = "" }) {
  const base = "animate-pulse bg-gray-200 dark:bg-zinc-700";
  const border = rounded ? "rounded-md" : "rounded-sm";
  return <div style={{ width, height }} className={`${base} ${border} ${className}`} />;
}
