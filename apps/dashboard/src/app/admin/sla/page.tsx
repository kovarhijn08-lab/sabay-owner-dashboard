'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, adminApi } from '../../../lib/api-client';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function AdminSLAPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [settings, setSettings] = useState<any[]>([]);
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
      const data = await adminApi.getSLASettings();
      setSettings(data as any);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'SLA настройки' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">SLA настройки</h1>
          <p className="text-white/60">Настройка SLA для обновлений данных</p>
        </div>
        {loading ? (
          <div className="bg-white/5 rounded-lg p-8 text-center text-white/60">Загрузка...</div>
        ) : (
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="border-b border-white/10 pb-4">
                <h3 className="font-semibold mb-2">{setting.type === 'construction_update' ? 'Обновления стройки' : 'Обновления аренды'}</h3>
                <p className="text-white/60">Режим: {setting.mode}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
