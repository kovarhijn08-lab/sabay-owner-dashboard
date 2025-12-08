'use client';

import React from 'react';

interface SwipeableCarouselProps {
  children: React.ReactNode;
}

export function SwipeableCarousel({ children }: SwipeableCarouselProps) {
  return <div className="overflow-x-auto">{children}</div>;
}
