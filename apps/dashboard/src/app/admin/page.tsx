'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '../../lib/api-client';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
  }, [router]);

  const menuItems = [
    { href: '/admin/users', label: 'Пользователи', description: 'Управление пользователями системы' },
    { href: '/admin/properties', label: 'Объекты', description: 'Назначение менеджеров и владельцев' },
    { href: '/admin/dictionaries', label: 'Справочники', description: 'Управление справочниками' },
    { href: '/admin/sla', label: 'SLA настройки', description: 'Настройка SLA для обновлений' },
    { href: '/admin/logs', label: 'Логи действий', description: 'Просмотр логов действий пользователей' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Admin' }]} />

        <div>
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-white/60">Управление системой</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition border border-white/10"
            >
              <h2 className="text-xl font-semibold mb-2">{item.label}</h2>
              <p className="text-white/60 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
