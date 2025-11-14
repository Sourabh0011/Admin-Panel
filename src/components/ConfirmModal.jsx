// src/components/ConfirmModal.jsx
import React from "react";

export default function ConfirmModal({ open, title = "Confirm", message = "", onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
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
      </div>
    </div>
  );
}
