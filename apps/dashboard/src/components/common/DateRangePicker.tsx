'use client';

import React, { useState } from 'react';

interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex gap-2">
      <input
        type="date"
        value={value.start}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
      />
      <input
        type="date"
        value={value.end}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
        className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
      />
    </div>
  );
}
