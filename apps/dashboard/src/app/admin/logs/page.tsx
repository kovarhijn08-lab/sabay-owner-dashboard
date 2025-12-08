'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, adminApi } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function AdminLogsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await adminApi.getLogs();
      setLogs(data as any[]);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<any>[] = [
    { key: 'createdAt', label: 'Дата', render: (log) => new Date(log.createdAt).toLocaleString('ru-RU') },
    { key: 'changeType', label: 'Тип действия' },
    { key: 'description', label: 'Описание', render: (log) => log.description || '-' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Логи' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">Логи действий</h1>
          <p className="text-white/60">Просмотр логов действий пользователей</p>
        </div>
        <DataTable columns={columns} data={logs} loading={loading} emptyMessage="Логи не найдены" />
      </div>
    </div>
  );
}
