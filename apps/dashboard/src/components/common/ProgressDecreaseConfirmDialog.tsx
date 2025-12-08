'use client';

import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

interface ProgressDecreaseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  oldValue: number;
  newValue: number;
}

export function ProgressDecreaseConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  oldValue,
  newValue,
}: ProgressDecreaseConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Подтверждение уменьшения прогресса"
      message={`Вы уверены, что хотите уменьшить прогресс стройки с ${oldValue}% до ${newValue}%?`}
    />
  );
}
