'use client';

import React from 'react';

interface SwipeableCardProps {
  children: React.ReactNode;
}

export function SwipeableCard({ children }: SwipeableCardProps) {
  return <div className="bg-white/5 rounded-lg p-6">{children}</div>;
}
