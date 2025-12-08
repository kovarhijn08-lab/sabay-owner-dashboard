'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authApi, managerApi } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../../components/ToastProvider';

export default function ManagerPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToastContext();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'manager') {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, params.id]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await managerApi.getPropertyById(params.id as string);
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
            { label: 'Manager', href: '/manager' },
            { label: property.name || 'Объект' },
          ]}
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-white/60">{property.region}</p>
        </div>
        <div className="flex gap-2 border-b border-white/10">
          {['overview', 'construction', 'bookings', 'expenses', 'payouts', 'valuations', 'documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab
                  ? 'text-sabay-primary border-b-2 border-sabay-primary'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab === 'overview' ? 'Обзор' : tab === 'construction' ? 'Стройка' : tab === 'bookings' ? 'Бронирования' : tab === 'expenses' ? 'Расходы' : tab === 'payouts' ? 'Выплаты' : tab === 'valuations' ? 'Оценки' : 'Документы'}
            </button>
          ))}
        </div>
        <div className="bg-white/5 rounded-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Статус</h3>
                <p>{property.status}</p>
              </div>
            </div>
          )}
          {activeTab !== 'overview' && (
            <p className="text-white/60">Раздел в разработке</p>
          )}
        </div>
      </div>
    </div>
  );
}
