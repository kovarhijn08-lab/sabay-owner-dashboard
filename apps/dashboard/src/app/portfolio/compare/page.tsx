'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '../../../lib/api-client';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';

export default function ComparePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель', href: '/portfolio' }, { label: 'Сравнение' }]} />
        <div>
          <h1 className="text-3xl font-bold mb-2">Сравнение объектов</h1>
          <p className="text-white/60">Сравнение объектов недвижимости</p>
        </div>
        <div className="bg-white/5 rounded-lg p-6">
          <p className="text-white/60">Функционал сравнения в разработке</p>
        </div>
      </div>
    </div>
  );
}
