'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, adminApi } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { FilterBar, FilterSelect } from '../../../components/common/FilterBar';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function AdminDictionariesPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [dictionaries, setDictionaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, filterType]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await adminApi.getDictionaries(filterType || undefined);
      setDictionaries(data as any[]);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<any>[] = [
    { key: 'key', label: 'Ключ' },
    { key: 'label', label: 'Название' },
    { key: 'type', label: 'Тип' },
    {
      key: 'isActive',
      label: 'Статус',
      render: (item) => (
        <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {item.isActive ? 'Активен' : 'Неактивен'}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Справочники' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">Управление справочниками</h1>
          <p className="text-white/60">Управление справочными данными</p>
        </div>
        <FilterBar>
          <FilterSelect
            label="Тип"
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: '', label: 'Все' },
              { value: 'booking_source', label: 'Источники бронирований' },
              { value: 'expense_type', label: 'Типы расходов' },
              { value: 'document_type', label: 'Типы документов' },
            ]}
          />
        </FilterBar>
        <DataTable columns={columns} data={dictionaries} loading={loading} emptyMessage="Справочники не найдены" />
      </div>
    </div>
  );
}
