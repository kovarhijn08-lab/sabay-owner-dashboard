'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authApi, managerApi, OwnerProperty } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { useToastContext } from '../../../../components/ToastProvider';
import { ConstructionUpdatesTab } from './tabs/ConstructionUpdatesTab';
import { BookingsTab } from './tabs/BookingsTab';
import { ExpensesTab } from './tabs/ExpensesTab';
import { PayoutsTab } from './tabs/PayoutsTab';
import { ValuationsTab } from './tabs/ValuationsTab';
import { DocumentsTab } from './tabs/DocumentsTab';

export default function ManagerPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToastContext();
  const [property, setProperty] = useState<OwnerProperty | null>(null);
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
      if (err.message?.includes('403') || err.message?.includes('доступа')) {
        router.push('/manager');
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/3"></div>
            <div className="h-12 bg-white/10 rounded w-1/2"></div>
            <div className="h-64 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 rounded-lg p-12 text-center border border-white/10">
            <svg className="mx-auto h-16 w-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Объект не найден</h3>
            <p className="text-white/60 mb-6">Объект с указанным ID не существует или у вас нет доступа</p>
            <button
              onClick={() => router.push('/manager')}
              className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
            >
              Вернуться к списку объектов
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'construction', label: 'Стройка' },
    { id: 'bookings', label: 'Бронирования' },
    { id: 'expenses', label: 'Расходы' },
    { id: 'payouts', label: 'Выплаты' },
    { id: 'valuations', label: 'Оценки' },
    { id: 'documents', label: 'Документы' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Manager', href: '/manager' },
            { label: property.name || 'Объект' },
          ]}
        />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-white/60">{property.region}</p>
              <StatusBadge status={property.status} />
            </div>
          </div>
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

        <div className="border-b border-white/10">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sabay-primary text-sabay-primary'
                    : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-1">Цена покупки</div>
                  <div className="text-2xl font-bold">
                    {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-1">Текущая оценка</div>
                  <div className="text-2xl font-bold">
                    {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-1">Прогресс стройки</div>
                  <div className="text-2xl font-bold">
                    {property.constructionProgress !== null ? `${property.constructionProgress}%` : '-'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-sm text-white/60 mb-1">Ожидаемый ADR</div>
                  <div className="text-2xl font-bold">
                    {property.expectedAdr ? `${property.expectedAdr.toLocaleString('ru-RU')} ₽/ночь` : '-'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-white/60 mb-1">Регион</div>
                      <div className="font-medium">{property.region || '-'}</div>
                    </div>
                    {property.constructionStage && (
                      <div>
                        <div className="text-sm text-white/60 mb-1">Этап стройки</div>
                        <div className="font-medium">{property.constructionStage}</div>
                      </div>
                    )}
                    {property.plannedCompletionDate && (
                      <div>
                        <div className="text-sm text-white/60 mb-1">Планируемая дата завершения</div>
                        <div className="font-medium">
                          {new Date(property.plannedCompletionDate).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Последние обновления</h3>
                  <div className="space-y-3">
                    {property.lastConstructionUpdateAt && (
                      <div>
                        <div className="text-sm text-white/60 mb-1">Последнее обновление стройки</div>
                        <div className="font-medium">
                          {new Date(property.lastConstructionUpdateAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    )}
                    {property.lastRentalUpdateAt && (
                      <div>
                        <div className="text-sm text-white/60 mb-1">Последнее обновление аренды</div>
                        <div className="font-medium">
                          {new Date(property.lastRentalUpdateAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    )}
                    {!property.lastConstructionUpdateAt && !property.lastRentalUpdateAt && (
                      <div className="text-white/40 text-sm">Нет обновлений</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'construction' && <ConstructionUpdatesTab propertyId={property.id} />}
          {activeTab === 'bookings' && <BookingsTab propertyId={property.id} />}
          {activeTab === 'expenses' && <ExpensesTab propertyId={property.id} />}
          {activeTab === 'payouts' && <PayoutsTab propertyId={property.id} />}
          {activeTab === 'valuations' && <ValuationsTab propertyId={property.id} />}
          {activeTab === 'documents' && <DocumentsTab propertyId={property.id} />}
        </div>
      </div>
    </div>
  );
}
