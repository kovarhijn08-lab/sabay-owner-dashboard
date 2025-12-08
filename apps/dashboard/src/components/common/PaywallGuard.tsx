'use client';

import React from 'react';

interface PaywallGuardProps {
  children: React.ReactNode;
  feature: string;
}

export function PaywallGuard({ children, feature }: PaywallGuardProps) {
  return <>{children}</>;
}
