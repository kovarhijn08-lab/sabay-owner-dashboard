'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authApi, portfolioApi } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { useToastContext } from '../../../../components/ToastProvider';

export default function PortfolioPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToastContext();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, params.id]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await portfolioApi.getPropertyById(params.id as string);
      setProperty(data);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">Загрузка...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">Объект не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Портфель', href: '/portfolio' },
            { label: 'Объекты', href: '/portfolio/properties' },
            { label: property.name || 'Объект' },
          ]}
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center gap-4">
            <p className="text-white/60">{property.region}</p>
            <StatusBadge status={property.status} />
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Цена покупки</h3>
            <p>{property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
