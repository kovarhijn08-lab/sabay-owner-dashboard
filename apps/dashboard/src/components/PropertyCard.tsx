'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge } from './common/StatusBadge';

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    region: string;
    status: string;
    purchasePrice?: number;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/portfolio/properties/${property.id}`}
      className="block bg-white/5 rounded-lg p-6 hover:bg-white/10 transition border border-white/10"
    >
      <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
      <p className="text-white/60 mb-2">{property.region}</p>
      <StatusBadge status={property.status} />
      {property.purchasePrice && (
        <p className="mt-4 text-lg font-semibold">
          {property.purchasePrice.toLocaleString('ru-RU')} ₽
        </p>
      )}
    </Link>
  );
}
