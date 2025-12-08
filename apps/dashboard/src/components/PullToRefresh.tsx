'use client';

import React from 'react';

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  return <div>{children}</div>;
}
