'use client';

import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  return (
    <div className={`px-4 py-3 rounded-lg ${
      type === 'success' ? 'bg-green-500/90' :
      type === 'error' ? 'bg-red-500/90' :
      'bg-blue-500/90'
    } text-white`}>
      {message}
      {onClose && (
        <button onClick={onClose} className="ml-4">×</button>
      )}
    </div>
  );
}
