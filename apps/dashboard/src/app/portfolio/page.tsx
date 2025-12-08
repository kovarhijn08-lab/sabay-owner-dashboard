'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, portfolioApi } from '../../lib/api-client';
import { DataTable, type Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { useToastContext } from '../../components/ToastProvider';

export default function PortfolioPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [properties, setProperties] = useState<any[]>([]);
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
      const data = await portfolioApi.getProperties();
      setProperties((data || []) as any[]);
    } catch (err: any) {
      console.error('Ошибка загрузки объектов:', err);
      const errorMessage = err?.message || 'Ошибка загрузки данных';
      // Если ошибка авторизации, редирект на логин уже выполнен в api-client
      if (!errorMessage.includes('Сессия истекла') && !errorMessage.includes('401')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Название',
      render: (property) => (
        <Link
          href={`/portfolio/properties/${property.id}`}
          className="font-medium text-sabay-primary hover:underline"
        >
          {property.name || '-'}
        </Link>
      ),
    },
    { key: 'region', label: 'Регион', render: (p) => p.region || '-' },
    {
      key: 'status',
      label: 'Статус',
      render: (property) => <StatusBadge status={property.status} />,
    },
    {
      key: 'purchasePrice',
      label: 'Цена покупки',
      render: (property) => property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель' }]} />
        
        {/* Заголовок и быстрые действия */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Мой портфель</h1>
            <p className="text-white/60">Управление объектами недвижимости</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => router.push('/portfolio/properties/new')}
              className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
            >
              + Создать объект
            </button>
            <button
              onClick={() => router.push('/portfolio/goals')}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Цели и прогнозы
            </button>
            <button
              onClick={() => router.push('/portfolio/notifications')}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10 relative"
            >
              Уведомления
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:opacity-50"
              aria-label="Обновить данные"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Таблица объектов */}
        {properties.length === 0 && !loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Объекты не найдены</h3>
            <p className="text-white/60 mb-6">Начните с создания первого объекта недвижимости</p>
            <button
              onClick={() => router.push('/portfolio/properties/new')}
              className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
            >
              + Создать первый объект
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={properties}
            loading={loading}
            emptyMessage="Объекты не найдены"
          />
        )}
      </div>
    </div>
  );
}
