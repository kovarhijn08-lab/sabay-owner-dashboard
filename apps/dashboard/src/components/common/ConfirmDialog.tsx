'use client';

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/60 mb-6">{message}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-white/80 hover:text-white transition rounded-lg hover:bg-white/5">
              Отмена
            </button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
