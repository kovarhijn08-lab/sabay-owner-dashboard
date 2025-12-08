'use client';

import React from 'react';
import { FormModal } from './common/FormModal';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  return (
    <FormModal isOpen={isOpen} onClose={onClose} title="Добавить событие">
      <p className="text-white/60">Форма добавления события в разработке</p>
    </FormModal>
  );
}
