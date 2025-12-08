'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, portfolioApi } from '../../../lib/api-client';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useToastContext } from '../../../components/ToastProvider';

export default function ComparePage() {
  const router = useRouter();
  const toast = useToastContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

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
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  function toggleProperty(id: string) {
    setSelectedProperties(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id);
      } else if (prev.length < 4) {
        return [...prev, id];
      } else {
        toast.error('Можно выбрать максимум 4 объекта для сравнения');
        return prev;
      }
    });
  }

  const propertiesToCompare = properties.filter(p => selectedProperties.includes(p.id));

  // Загрузка аналитики для выбранных объектов
  useEffect(() => {
    if (propertiesToCompare.length === 0) {
      setAnalytics({});
      return;
    }

    async function loadAnalytics() {
      setLoadingAnalytics(true);
      try {
        const analyticsData: Record<string, any> = {};
        await Promise.all(
          propertiesToCompare.map(async (property) => {
            try {
              const data = await portfolioApi.getPropertyAnalytics(property.id);
              analyticsData[property.id] = data;
            } catch (err) {
              console.error(`Ошибка загрузки аналитики для ${property.id}:`, err);
            }
          })
        );
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Ошибка загрузки аналитики:', err);
      } finally {
        setLoadingAnalytics(false);
      }
    }

    loadAnalytics();
  }, [propertiesToCompare.map(p => p.id).join(',')]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель', href: '/portfolio' }, { label: 'Сравнение' }]} />
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Сравнение объектов</h1>
            <p className="text-white/60">Выберите до 4 объектов для сравнения</p>
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

        {/* Выбор объектов */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Выберите объекты для сравнения</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-lg animate-pulse border border-white/10"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>Нет объектов для сравнения</p>
              <Link href="/portfolio/properties/new" className="text-sabay-primary hover:underline mt-2 inline-block">
                Создать объект
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map(property => {
                const isSelected = selectedProperties.includes(property.id);
                return (
                  <button
                    key={property.id}
                    onClick={() => toggleProperty(property.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      isSelected
                        ? 'border-sabay-primary bg-sabay-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{property.name}</h3>
                      {isSelected && (
                        <svg className="w-5 h-5 text-sabay-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-2">{property.region}</p>
                    <StatusBadge status={property.status} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Таблица сравнения */}
        {propertiesToCompare.length > 0 && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Сравнение</h2>
              {loadingAnalytics && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Загрузка аналитики...</span>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-3 font-semibold">Параметр</th>
                    {propertiesToCompare.map(property => (
                      <th key={property.id} className="text-left p-3 font-semibold">
                        <Link href={`/portfolio/properties/${property.id}`} className="text-sabay-primary hover:underline">
                          {property.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Регион</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">{property.region || '-'}</td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Статус</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        <StatusBadge status={property.status} />
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Цена покупки</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Текущая оценка</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">ROI</td>
                    {propertiesToCompare.map(property => {
                      const purchasePrice = property.purchasePrice || 0;
                      const currentValue = property.currentEstimate || purchasePrice;
                      const roi = purchasePrice > 0 ? ((currentValue - purchasePrice) / purchasePrice) * 100 : 0;
                      return (
                        <td key={property.id} className={`p-3 font-semibold ${roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : ''}`}>
                          {roi > 0 ? '+' : ''}{roi.toFixed(2)}%
                        </td>
                      );
                    })}
                  </tr>
                  {loadingAnalytics ? (
                    <tr className="border-b border-white/5">
                      <td colSpan={propertiesToCompare.length + 1} className="p-3 text-center text-white/60">
                        Загрузка расширенной аналитики...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {propertiesToCompare.some(p => analytics[p.id]?.irr !== null && analytics[p.id]?.irr !== undefined) && (
                        <tr className="border-b border-white/5">
                          <td className="p-3 text-white/60">IRR</td>
                          {propertiesToCompare.map(property => {
                            const irr = analytics[property.id]?.irr;
                            return (
                              <td key={property.id} className={`p-3 ${irr !== null && irr !== undefined && irr > 0 ? 'text-green-400' : ''}`}>
                                {irr !== null && irr !== undefined && isFinite(irr) && Math.abs(irr) < 1000
                                  ? `${irr > 0 ? '+' : ''}${irr.toFixed(2)}%`
                                  : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                      {propertiesToCompare.some(p => analytics[p.id]?.cagr !== null && analytics[p.id]?.cagr !== undefined) && (
                        <tr className="border-b border-white/5">
                          <td className="p-3 text-white/60">CAGR</td>
                          {propertiesToCompare.map(property => {
                            const cagr = analytics[property.id]?.cagr;
                            return (
                              <td key={property.id} className={`p-3 ${cagr !== null && cagr !== undefined && cagr > 0 ? 'text-green-400' : ''}`}>
                                {cagr !== null && cagr !== undefined && isFinite(cagr) && Math.abs(cagr) < 1000
                                  ? `${cagr > 0 ? '+' : ''}${cagr.toFixed(2)}%`
                                  : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                      {propertiesToCompare.some(p => analytics[p.id]?.paybackPeriodYears !== null && analytics[p.id]?.paybackPeriodYears !== undefined) && (
                        <tr className="border-b border-white/5">
                          <td className="p-3 text-white/60">Период окупаемости</td>
                          {propertiesToCompare.map(property => {
                            const payback = analytics[property.id]?.paybackPeriodYears;
                            return (
                              <td key={property.id} className="p-3">
                                {payback !== null && payback !== undefined && isFinite(payback) && payback > 0 && payback < 100
                                  ? `${payback.toFixed(1)} ${payback === 1 ? 'год' : payback < 5 ? 'года' : 'лет'}`
                                  : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                      {propertiesToCompare.some(p => analytics[p.id]?.yieldPercent !== null && analytics[p.id]?.yieldPercent !== undefined) && (
                        <tr className="border-b border-white/5">
                          <td className="p-3 text-white/60">Доходность (Yield)</td>
                          {propertiesToCompare.map(property => {
                            const yieldPercent = analytics[property.id]?.yieldPercent;
                            return (
                              <td key={property.id} className="p-3 text-sabay-primary">
                                {yieldPercent !== null && yieldPercent !== undefined && isFinite(yieldPercent) && Math.abs(yieldPercent) < 100
                                  ? `${yieldPercent.toFixed(2)}%`
                                  : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </>
                  )}
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Прогресс стройки</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        {property.constructionProgress !== null ? `${property.constructionProgress}%` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="p-3 text-white/60">Ожидаемый ADR</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        {property.expectedAdr ? `${property.expectedAdr.toLocaleString('ru-RU')} ₽/ночь` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-white/60">Ожидаемая загрузка</td>
                    {propertiesToCompare.map(property => (
                      <td key={property.id} className="p-3">
                        {property.expectedOccupancy !== null ? `${property.expectedOccupancy}%` : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Мобильная версия (карточки) */}
        {propertiesToCompare.length > 0 && (
          <div className="md:hidden space-y-4">
            {propertiesToCompare.map(property => {
              const purchasePrice = property.purchasePrice || 0;
              const currentValue = property.currentEstimate || purchasePrice;
              const roi = purchasePrice > 0 ? ((currentValue - purchasePrice) / purchasePrice) * 100 : 0;
              return (
                <div key={property.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <Link href={`/portfolio/properties/${property.id}`} className="text-sabay-primary hover:underline font-semibold mb-2 block">
                    {property.name}
                  </Link>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-white/60">Регион:</span> {property.region || '-'}</div>
                    <div><span className="text-white/60">Статус:</span> <StatusBadge status={property.status} /></div>
                    <div><span className="text-white/60">Цена покупки:</span> {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}</div>
                    <div><span className="text-white/60">Текущая оценка:</span> {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}</div>
                    <div><span className="text-white/60">ROI:</span> <span className={roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : ''}>{roi > 0 ? '+' : ''}{roi.toFixed(2)}%</span></div>
                    {property.constructionProgress !== null && (
                      <div><span className="text-white/60">Прогресс стройки:</span> {property.constructionProgress}%</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
