'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, portfolioApi } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function NotificationsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await portfolioApi.getNotifications();
      setNotifications(data as any[]);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<any>[] = [
    { key: 'title', label: 'Заголовок' },
    { key: 'message', label: 'Сообщение', render: (n) => n.message || '-' },
    {
      key: 'isRead',
      label: 'Статус',
      render: (n) => (
        <span className={`px-2 py-1 rounded text-xs ${n.isRead ? 'bg-gray-500/20 text-gray-300' : 'bg-blue-500/20 text-blue-300'}`}>
          {n.isRead ? 'Прочитано' : 'Новое'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Дата', render: (n) => new Date(n.createdAt).toLocaleString('ru-RU') },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель', href: '/portfolio' }, { label: 'Уведомления' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">Уведомления</h1>
          <p className="text-white/60">Все уведомления системы</p>
        </div>
        <DataTable
          columns={columns}
          data={notifications}
          loading={loading}
          emptyMessage="Уведомления не найдены"
        />
      </div>
    </div>
  );
}
