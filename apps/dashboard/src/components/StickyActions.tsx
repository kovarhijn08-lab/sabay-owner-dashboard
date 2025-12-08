'use client';

import React from 'react';

interface StickyActionsProps {
  children: React.ReactNode;
}

export function StickyActions({ children }: StickyActionsProps) {
  return <div className="sticky bottom-0 bg-slate-950 p-4 border-t border-white/10">{children}</div>;
}
