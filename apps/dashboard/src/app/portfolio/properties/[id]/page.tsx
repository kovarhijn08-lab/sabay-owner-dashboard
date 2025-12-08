'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authApi, portfolioApi } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { StatusBadge } from '../../../../components/common/StatusBadge';
import { useToastContext } from '../../../../components/ToastProvider';

type TabType = 'overview' | 'history' | 'metrics';

export default function PortfolioPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToastContext();
  const [property, setProperty] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({ expectedAdr: '', expectedOccupancy: '' });
  const [savingRental, setSavingRental] = useState(false);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, params.id]);

  useEffect(() => {
    if (activeTab === 'history' && property?.id) {
      loadHistory();
    }
    if (activeTab === 'metrics' && property?.id) {
      loadAnalytics();
    }
  }, [activeTab, property?.id]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await portfolioApi.getPropertyById(params.id as string);
      setProperty(data);
      // Инициализация формы аренды
      setRentalFormData({
        expectedAdr: data.expectedAdr?.toString() || '',
        expectedOccupancy: data.expectedOccupancy?.toString() || '',
      });
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  function openRentalModal() {
    setRentalFormData({
      expectedAdr: property?.expectedAdr?.toString() || '',
      expectedOccupancy: property?.expectedOccupancy?.toString() || '',
    });
    setShowRentalModal(true);
  }

  async function saveRentalData() {
    if (!property) return;
    
    setSavingRental(true);
    try {
      const updateData: any = {};
      
      if (rentalFormData.expectedAdr.trim()) {
        const adr = parseFloat(rentalFormData.expectedAdr.replace(/\s/g, ''));
        if (!isNaN(adr) && adr >= 0) {
          updateData.expectedAdr = adr;
        }
      } else {
        updateData.expectedAdr = null;
      }
      
      if (rentalFormData.expectedOccupancy.trim()) {
        const occupancy = parseInt(rentalFormData.expectedOccupancy, 10);
        if (!isNaN(occupancy) && occupancy >= 0 && occupancy <= 100) {
          updateData.expectedOccupancy = occupancy;
        }
      } else {
        updateData.expectedOccupancy = null;
      }

      // Если статус не "rental", меняем его
      if (property.status !== 'rental') {
        updateData.status = 'rental';
      }

      await portfolioApi.updateProperty(property.id, updateData);
      toast.success('Показатели аренды обновлены');
      setShowRentalModal(false);
      await loadData(); // Перезагружаем данные
      if (activeTab === 'metrics') {
        await loadAnalytics(); // Перезагружаем аналитику
      }
    } catch (err: any) {
      console.error('Ошибка сохранения показателей аренды:', err);
      toast.error(err.message || 'Ошибка сохранения показателей аренды');
    } finally {
      setSavingRental(false);
    }
  }

  const formatPrice = (value: string) => {
    if (!value) return '';
    const num = value.replace(/\s/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  async function loadHistory() {
    try {
      setLoadingHistory(true);
      const data = await portfolioApi.getPropertyHistory(params.id as string, 50);
      setHistory((data || []) as any[]);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки истории');
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadAnalytics() {
    try {
      setLoadingAnalytics(true);
      const data = await portfolioApi.getPropertyAnalytics(params.id as string);
      setAnalytics(data);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки аналитики');
    } finally {
      setLoadingAnalytics(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-white/5 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
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
            <p className="text-white/60 mb-6">Объект с указанным ID не существует или был удален</p>
            <button
              onClick={() => router.push('/portfolio/properties')}
              className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
            >
              Вернуться к списку объектов
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Расчет метрик
  const valueGrowth = property.currentEstimate && property.purchasePrice
    ? property.currentEstimate - property.purchasePrice
    : null;
  const valueGrowthPercent = valueGrowth && property.purchasePrice
    ? (valueGrowth / property.purchasePrice) * 100
    : null;
  const roi = valueGrowthPercent || 0;

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
        
        {/* Заголовок */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-white/60">{property.region}</p>
              <StatusBadge status={property.status} />
            </div>
          </div>
          <div className="flex items-center gap-3">
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
            <button
              onClick={() => router.push(`/portfolio/properties/${property.id}/edit`)}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Редактировать
            </button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-sabay-primary text-sabay-primary'
                  : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Обзор
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-sabay-primary text-sabay-primary'
                  : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                История
                {history.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-sabay-primary/20 text-sabay-primary rounded-full">
                    {history.length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                activeTab === 'metrics'
                  ? 'border-sabay-primary text-sabay-primary'
                  : 'border-transparent text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Метрики
              </span>
            </button>
          </nav>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'overview' && (
          <>
        {/* Основные метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-white/60">Цена покупки</div>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">
              {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}
            </div>
            {property.purchaseDate && (
              <div className="text-xs text-white/40 mt-2 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(property.purchaseDate).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-white/60">Текущая оценка</div>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-2xl font-bold">
              {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}
            </div>
            {valueGrowthPercent !== null && (
              <div className={`text-xs mt-2 flex items-center gap-1 ${valueGrowthPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {valueGrowthPercent > 0 ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {valueGrowthPercent > 0 ? '+' : ''}{valueGrowthPercent.toFixed(2)}%
              </div>
            )}
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-white/60">ROI</div>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className={`text-2xl font-bold ${roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : ''}`}>
              {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-white/60">Прогресс стройки</div>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold">
              {property.constructionProgress !== null ? `${property.constructionProgress}%` : '-'}
            </div>
            {property.constructionProgress !== null && (
              <div className="mt-2">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-sabay-primary h-2 rounded-full transition-all"
                    style={{ width: `${property.constructionProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {property.constructionStage && (
              <div className="text-xs text-white/40 mt-2">{property.constructionStage}</div>
            )}
          </div>
        </div>

        {/* Детальная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-white/60 mb-1">Регион</div>
                <div className="font-medium">{property.region || '-'}</div>
              </div>
              {property.unit?.unitNumber && (
                <div>
                  <div className="text-sm text-white/60 mb-1">Номер юнита</div>
                  <div className="font-medium font-mono">{property.unit.unitNumber}</div>
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
              {property.actualCompletionDate && (
                <div>
                  <div className="text-sm text-white/60 mb-1">Фактическая дата завершения</div>
                  <div className="font-medium">
                    {new Date(property.actualCompletionDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Аренда</h3>
              <button
                onClick={openRentalModal}
                className="px-3 py-1.5 text-sm bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {property.expectedAdr || property.expectedOccupancy ? 'Изменить' : 'Добавить'}
              </button>
            </div>
            <div className="space-y-3">
              {property.expectedAdr !== null ? (
                <div>
                  <div className="text-sm text-white/60 mb-1">Ожидаемый ADR</div>
                  <div className="font-medium">{property.expectedAdr.toLocaleString('ru-RU')} ₽/ночь</div>
                </div>
              ) : (
                <div className="text-sm text-white/40">ADR не указан</div>
              )}
              {property.expectedOccupancy !== null ? (
                <div>
                  <div className="text-sm text-white/60 mb-1">Ожидаемая загрузка</div>
                  <div className="font-medium">{property.expectedOccupancy}%</div>
                </div>
              ) : (
                <div className="text-sm text-white/40">Загрузка не указана</div>
              )}
              {property.manager && (
                <div>
                  <div className="text-sm text-white/60 mb-1">Менеджер</div>
                  <div className="font-medium">
                    {property.manager.name || property.manager.email || '-'}
                  </div>
                </div>
              )}
              {property.managementCompany && (
                <div>
                  <div className="text-sm text-white/60 mb-1">Управляющая компания</div>
                  <div className="font-medium">{property.managementCompany.name || '-'}</div>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">История изменений</h3>
              {history.length > 0 && (
                <span className="text-sm text-white/60">{history.length} событий</span>
              )}
            </div>
            {loadingHistory ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-l-2 border-white/10 pl-4 py-3">
                    <div className="h-5 bg-white/10 rounded animate-pulse mb-2 w-1/3"></div>
                    <div className="h-4 bg-white/5 rounded animate-pulse w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-medium text-white/80 mb-2">История изменений пуста</h4>
                <p className="text-white/60">События появятся здесь при изменении объекта</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((event, index) => (
                  <div
                    key={event.id}
                    className={`border-l-2 pl-4 py-3 transition hover:bg-white/5 rounded-r-lg ${
                      index === 0 ? 'border-sabay-primary' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            index === 0 ? 'bg-sabay-primary' : 'bg-white/20'
                          }`}></div>
                          <div className="font-medium text-white/90">{getEventTitle(event.changeType)}</div>
                        </div>
                        {event.description && (
                          <div className="text-sm text-white/60 mt-1 ml-4">{event.description}</div>
                        )}
                        {event.beforeValue && event.afterValue && (
                          <div className="text-xs mt-2 ml-4 flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded line-through">
                              {formatEventValue(event.beforeValue)}
                            </span>
                            <span className="text-white/40">→</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">
                              {formatEventValue(event.afterValue)}
                            </span>
                          </div>
                        )}
                        {event.createdBy && (
                          <div className="text-xs text-white/40 mt-2 ml-4">
                            Изменено: <span className="text-white/60">{event.createdBy.name || event.createdBy.email || 'Система'}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-white/40 whitespace-nowrap">
                        {formatEventDate(event.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-6">Детальные метрики</h3>
            {loadingAnalytics ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sabay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Финансовые показатели
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/60">Цена покупки</span>
                      <span className="font-semibold text-lg">
                        {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/60">Текущая оценка</span>
                      <span className="font-semibold text-lg">
                        {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}
                      </span>
                    </div>
                    {valueGrowth !== null && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/60">Прирост стоимости</span>
                        <span className={`font-semibold text-lg ${valueGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {valueGrowth > 0 ? '+' : ''}{valueGrowth.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/60">ROI</span>
                      <span className={`font-semibold text-lg ${roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : ''}`}>
                        {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2">
                    <svg className="w-5 h-5 text-sabay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-sabay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Показатели аренды
                      </span>
                      <button
                        onClick={openRentalModal}
                        className="px-3 py-1.5 text-xs bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {property.expectedAdr || property.expectedOccupancy ? 'Изменить' : 'Добавить'}
                      </button>
                    </div>
                  </h4>
                  <div className="space-y-4">
                    {property.expectedAdr !== null ? (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/60">Ожидаемый ADR</span>
                        <span className="font-semibold text-lg">{property.expectedAdr.toLocaleString('ru-RU')} ₽/ночь</span>
                      </div>
                    ) : (
                      <div className="text-white/40 text-sm py-2">ADR не указан</div>
                    )}
                    {property.expectedOccupancy !== null ? (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/60">Ожидаемая загрузка</span>
                        <span className="font-semibold text-lg">{property.expectedOccupancy}%</span>
                      </div>
                    ) : (
                      <div className="text-white/40 text-sm py-2">Загрузка не указана</div>
                    )}
                    {analytics?.forecastAnnualIncome ? (
                      <div className="flex justify-between items-center py-2 bg-sabay-primary/10 rounded-lg px-3">
                        <span className="text-white/80 font-medium">Прогноз годового дохода</span>
                        <span className="font-bold text-lg text-sabay-primary">
                          {analytics.forecastAnnualIncome.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ) : (
                      <div className="text-white/40 text-sm py-2">Укажите ADR и загрузку для расчета прогноза</div>
                    )}
                    {analytics?.yieldPercent !== null && analytics?.yieldPercent !== undefined && isFinite(analytics.yieldPercent) && Math.abs(analytics.yieldPercent) < 100 && (
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/60">Доходность (Yield)</span>
                        <span className="font-semibold text-lg text-sabay-primary">
                          {formatMetricValue(analytics.yieldPercent)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Расширенная аналитика */}
            {analytics && (
              <div className="mt-6 bg-white/5 rounded-lg p-5 border border-white/10">
                <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2">
                  <svg className="w-5 h-5 text-sabay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Расширенная аналитика
                </h4>
                {(() => {
                  const hasValidMetrics = 
                    (analytics.irr !== null && analytics.irr !== undefined && isFinite(analytics.irr) && Math.abs(analytics.irr) < 1000) ||
                    (analytics.cagr !== null && analytics.cagr !== undefined && isFinite(analytics.cagr) && Math.abs(analytics.cagr) < 1000) ||
                    (analytics.paybackPeriodYears !== null && analytics.paybackPeriodYears !== undefined && isFinite(analytics.paybackPeriodYears) && analytics.paybackPeriodYears > 0 && analytics.paybackPeriodYears < 100) ||
                    (analytics.yieldPercent !== null && analytics.yieldPercent !== undefined && isFinite(analytics.yieldPercent) && Math.abs(analytics.yieldPercent) < 100);
                  
                  if (!hasValidMetrics) {
                    return (
                      <div className="text-center py-8 text-white/40">
                        <svg className="mx-auto h-12 w-12 text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm">Расширенная аналитика будет доступна после накопления достаточных данных</p>
                        <p className="text-xs text-white/30 mt-1">IRR и CAGR рассчитываются для объектов, находящихся в собственности более 7 дней</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {analytics.irr !== null && analytics.irr !== undefined && isFinite(analytics.irr) && Math.abs(analytics.irr) < 1000 ? (
                        <div className="text-center bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="text-xs text-white/60 mb-1">IRR</div>
                          <div className="text-xl font-bold text-sabay-primary">
                            {analytics.irr > 0 ? '+' : ''}{formatMetricValue(analytics.irr)}%
                          </div>
                          <div className="text-xs text-white/40 mt-1">Внутренняя норма доходности</div>
                        </div>
                      ) : null}
                      {analytics.cagr !== null && analytics.cagr !== undefined && isFinite(analytics.cagr) && Math.abs(analytics.cagr) < 1000 ? (
                        <div className="text-center bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="text-xs text-white/60 mb-1">CAGR</div>
                          <div className="text-xl font-bold text-green-400">
                            {analytics.cagr > 0 ? '+' : ''}{formatMetricValue(analytics.cagr)}%
                          </div>
                          <div className="text-xs text-white/40 mt-1">Среднегодовой рост</div>
                        </div>
                      ) : null}
                      {analytics.paybackPeriodYears !== null && analytics.paybackPeriodYears !== undefined && isFinite(analytics.paybackPeriodYears) && analytics.paybackPeriodYears > 0 && analytics.paybackPeriodYears < 100 ? (
                        <div className="text-center bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="text-xs text-white/60 mb-1">Payback Period</div>
                          <div className="text-xl font-bold text-yellow-400">
                            {formatMetricValue(analytics.paybackPeriodYears)} {analytics.paybackPeriodYears === 1 ? 'год' : analytics.paybackPeriodYears < 5 ? 'года' : 'лет'}
                          </div>
                          <div className="text-xs text-white/40 mt-1">Период окупаемости</div>
                        </div>
                      ) : null}
                      {analytics.yieldPercent !== null && analytics.yieldPercent !== undefined && isFinite(analytics.yieldPercent) && Math.abs(analytics.yieldPercent) < 100 ? (
                        <div className="text-center bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="text-xs text-white/60 mb-1">Yield</div>
                          <div className="text-xl font-bold text-blue-400">
                            {formatMetricValue(analytics.yieldPercent)}%
                          </div>
                          <div className="text-xs text-white/40 mt-1">Доходность</div>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модальное окно для редактирования показателей аренды */}
      {showRentalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-lg border border-white/20 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Показатели аренды</h3>
              <button
                onClick={() => setShowRentalModal(false)}
                className="text-white/60 hover:text-white transition"
                aria-label="Закрыть"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ожидаемый ADR (₽/ночь)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatPrice(rentalFormData.expectedAdr)}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^\d\s]/g, '');
                      setRentalFormData({ ...rentalFormData, expectedAdr: cleaned });
                    }}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary font-mono"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">₽</span>
                </div>
                <p className="text-xs text-white/50 mt-1">Средняя дневная ставка аренды</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Ожидаемая загрузка (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rentalFormData.expectedOccupancy}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 100)) {
                      setRentalFormData({ ...rentalFormData, expectedOccupancy: value });
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                  placeholder="0"
                />
                <p className="text-xs text-white/50 mt-1">Процент занятости объекта (0-100%)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRentalModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button
                onClick={saveRentalData}
                disabled={savingRental}
                className="flex-1 px-4 py-3 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingRental ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getEventTitle(changeType: string): string {
  const titles: Record<string, string> = {
    'property_created': 'Объект создан',
    'property_updated': 'Объект обновлен',
    'status_changed': 'Изменен статус',
    'valuation_updated': 'Обновлена оценка стоимости',
    'construction_progress': 'Обновлен прогресс стройки',
    'construction_stage': 'Изменен этап стройки',
    'manager_assigned': 'Назначен менеджер',
    'manager_changed': 'Изменен менеджер',
    'management_company_assigned': 'Назначена управляющая компания',
    'expense_added': 'Добавлен расход',
    'booking_added': 'Добавлено бронирование',
    'income_updated': 'Обновлен доход',
  };
  return titles[changeType] || changeType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatEventValue(value: any): string {
  if (typeof value === 'object' && value !== null) {
    if (value.amount) return `${value.amount.toLocaleString('ru-RU')} ₽`;
    if (value.value) return String(value.value);
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    return value.toLocaleString('ru-RU');
  }
  return String(value);
}

function formatEventDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatMetricValue(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '-';
  
  // Для процентов: ограничиваем разумный диапазон
  if (Math.abs(value) > 1000) {
    return '-'; // Слишком большое значение - не показываем
  }
  
  // Для обычных значений используем фиксированное количество знаков
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  }
  
  // Для значений меньше 0.01, показываем как есть с 4 знаками
  if (Math.abs(value) < 0.01 && value !== 0) {
    return value.toFixed(4);
  }
  
  // Стандартное форматирование с 2 знаками после запятой
  return value.toFixed(2);
}
