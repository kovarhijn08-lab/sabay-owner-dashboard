'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, portfolioApi } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function PortfolioPropertiesPage() {
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
      setProperties(data);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
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
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель', href: '/portfolio' }, { label: 'Объекты' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">Мои объекты</h1>
          <p className="text-white/60">Список всех объектов</p>
        </div>
        <DataTable
          columns={columns}
          data={properties}
          loading={loading}
          emptyMessage="Объекты не найдены"
        />
      </div>
    </div>
  );
}
