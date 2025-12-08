'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authApi } from '../lib/api-client';

export function Navigation() {
  const pathname = usePathname();
  const user = authApi.getCurrentUser();

  if (!user) return null;

  const navItems = [
    ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(user.role === 'manager' ? [{ href: '/manager', label: 'Manager' }] : []),
    { href: '/portfolio', label: 'Портфель' },
    ...(user.role === 'owner' ? [
      { href: '/portfolio/catalog', label: 'Каталог' },
      { href: '/portfolio/goals', label: 'Цели' },
      { href: '/portfolio/notifications', label: 'Уведомления' },
      { href: '/portfolio/compare', label: 'Сравнение' },
    ] : []),
  ];

  return (
    <nav className="bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded transition ${
                pathname?.startsWith(item.href)
                  ? 'bg-sabay-primary/20 text-sabay-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => {
            authApi.logout();
            window.location.href = '/login';
          }}
          className="px-4 py-2 text-white/60 hover:text-white transition"
        >
          Выход
        </button>
      </div>
    </nav>
  );
}
