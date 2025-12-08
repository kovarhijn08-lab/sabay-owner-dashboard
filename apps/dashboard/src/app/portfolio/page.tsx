'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

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
      const [propertiesData, summaryData, chartDataResult] = await Promise.all([
        portfolioApi.getProperties(),
        portfolioApi.getSummary(),
        portfolioApi.getChartData().catch(() => null), // Не критично, если не загрузится
      ]);
      setProperties((propertiesData || []) as any[]);
      setSummary(summaryData);
      setChartData(chartDataResult);
    } catch (err: any) {
      console.error('Ошибка загрузки данных:', err);
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
              onClick={() => router.push('/portfolio/compare')}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Сравнение
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

        {/* Сводка по портфелю */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-white/60">Всего объектов</div>
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-3xl font-bold">{summary.totalProperties}</div>
              <div className="text-xs text-white/40 mt-2">
                {summary.rentalCount} в аренде, {summary.constructionCount} в строительстве
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-white/60">Стоимость покупки</div>
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold">
                {summary.totalPurchaseValue.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-white/60">Текущая стоимость</div>
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-3xl font-bold">
                {summary.totalCurrentValue.toLocaleString('ru-RU')} ₽
              </div>
              {summary.valueGrowthPercent !== 0 && (
                <div className={`text-xs mt-2 flex items-center gap-1 ${summary.valueGrowthPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {summary.valueGrowthPercent > 0 ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {summary.valueGrowthPercent > 0 ? '+' : ''}{summary.valueGrowthPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-white/20 transition">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm text-white/60">Средний ROI</div>
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className={`text-3xl font-bold ${summary.averageROI > 0 ? 'text-green-400' : summary.averageROI < 0 ? 'text-red-400' : ''}`}>
                {summary.averageROI > 0 ? '+' : ''}{summary.averageROI.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Графики */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="h-6 bg-white/10 rounded animate-pulse mb-4"></div>
                <div className="h-64 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : chartData && properties.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График динамики стоимости */}
            {chartData.valueHistory && chartData.valueHistory.length > 0 && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Динамика стоимости портфеля</h3>
                  <span className="text-xs text-white/40">
                    {chartData.valueHistory.length} {chartData.valueHistory.length === 1 ? 'точка' : chartData.valueHistory.length < 5 ? 'точки' : 'точек'}
                  </span>
                </div>
                <div className="relative">
                  {(() => {
                    const data = chartData.valueHistory;
                    const maxValue = Math.max(
                      ...data.map(d => Math.max(d.purchaseValue, d.currentValue))
                    );
                    const minValue = Math.min(
                      ...data.map(d => Math.min(d.purchaseValue, d.currentValue))
                    );
                    const range = maxValue - minValue || 1;
                    const width = 600;
                    const height = 300;
                    const paddingLeft = 60;
                    const paddingRight = 20;
                    const paddingTop = 20;
                    const paddingBottom = 40;
                    const chartWidth = width - paddingLeft - paddingRight;
                    const chartHeight = height - paddingTop - paddingBottom;

                    // Форматирование дат
                    const formatDate = (dateStr: string) => {
                      const date = new Date(dateStr);
                      return date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
                    };

                    // Форматирование стоимости
                    const formatValue = (value: number) => {
                      if (value >= 1e9) return `${(value / 1e9).toFixed(1)} млрд ₽`;
                      if (value >= 1e6) return `${(value / 1e6).toFixed(1)} млн ₽`;
                      if (value >= 1e3) return `${(value / 1e3).toFixed(0)} тыс ₽`;
                      return `${value.toFixed(0)} ₽`;
                    };

                    // Генерация подписей для оси Y (5 значений)
                    const yTicks = 5;
                    const yValues: number[] = [];
                    for (let i = 0; i < yTicks; i++) {
                      yValues.push(minValue + (range / (yTicks - 1)) * i);
                    }

                    // Генерация подписей для оси X (максимум 6 дат)
                    const xTicksCount = Math.min(data.length, 6);
                    const xIndices: number[] = [];
                    if (data.length <= 6) {
                      for (let i = 0; i < data.length; i++) {
                        xIndices.push(i);
                      }
                    } else {
                      xIndices.push(0); // Первая точка
                      const step = Math.floor((data.length - 1) / (xTicksCount - 1));
                      for (let i = 1; i < xTicksCount - 1; i++) {
                        xIndices.push(i * step);
                      }
                      xIndices.push(data.length - 1); // Последняя точка
                    }

                    const purchasePoints = data.map((d, i) => {
                      const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
                      const y = paddingTop + chartHeight - ((d.purchaseValue - minValue) / range) * chartHeight;
                      return { x, y, value: d.purchaseValue, date: d.date };
                    });

                    const currentPoints = data.map((d, i) => {
                      const x = paddingLeft + (i / (data.length - 1 || 1)) * chartWidth;
                      const y = paddingTop + chartHeight - ((d.currentValue - minValue) / range) * chartHeight;
                      return { x, y, value: d.currentValue, date: d.date };
                    });

                    const purchasePolyline = purchasePoints.map(p => `${p.x},${p.y}`).join(' ');
                    const currentPolyline = currentPoints.map(p => `${p.x},${p.y}`).join(' ');

                    const handlePointHover = (e: React.MouseEvent<SVGCircleElement>, point: { value: number; date: string; x: number; y: number }, type: 'purchase' | 'current') => {
                      const svg = e.currentTarget.ownerSVGElement;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const viewBox = svg.viewBox.baseVal;
                      
                      // Конвертируем SVG координаты в пиксели экрана
                      const pixelX = (point.x / viewBox.width) * rect.width;
                      const pixelY = (point.y / viewBox.height) * rect.height;
                      
                      const date = new Date(point.date);
                      const fullDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                      const formattedValue = point.value.toLocaleString('ru-RU');
                      setTooltip({
                        x: pixelX + rect.left,
                        y: pixelY + rect.top,
                        text: `${type === 'purchase' ? 'Покупка' : 'Текущая'}: ${formattedValue} ₽\n${fullDate}`,
                      });
                    };

                    const handlePointLeave = () => {
                      setTooltip(null);
                    };

                    return (
                      <div className="relative">
                        {tooltip && (
                          <div
                            className="fixed z-50 bg-slate-900 border border-white/20 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none"
                            style={{
                              left: `${tooltip.x}px`,
                              top: `${tooltip.y - 60}px`,
                              transform: 'translateX(-50%)',
                            }}
                          >
                            <div className="text-white whitespace-pre-line text-center">{tooltip.text}</div>
                          </div>
                        )}
                        <svg className="w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <linearGradient id="purchaseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Сетка по оси Y */}
                          {yValues.map((value, i) => {
                            const y = paddingTop + chartHeight - ((value - minValue) / range) * chartHeight;
                            return (
                              <g key={`y-grid-${i}`}>
                                <line
                                  x1={paddingLeft}
                                  y1={y}
                                  x2={width - paddingRight}
                                  y2={y}
                                  stroke="rgba(255,255,255,0.05)"
                                  strokeWidth="1"
                                />
                              </g>
                            );
                          })}

                          {/* Сетка по оси X */}
                          {xIndices.map((idx) => {
                            const x = paddingLeft + (idx / (data.length - 1 || 1)) * chartWidth;
                            return (
                              <line
                                key={`x-grid-${idx}`}
                                x1={x}
                                y1={paddingTop}
                                x2={x}
                                y2={height - paddingBottom}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                              />
                            );
                          })}

                          {/* Область под линией покупки */}
                          <polygon
                            points={`${paddingLeft},${height - paddingBottom} ${purchasePolyline} ${width - paddingRight},${height - paddingBottom}`}
                            fill="url(#purchaseGradient)"
                          />
                          {/* Область под линией текущей стоимости */}
                          <polygon
                            points={`${paddingLeft},${height - paddingBottom} ${currentPolyline} ${width - paddingRight},${height - paddingBottom}`}
                            fill="url(#currentGradient)"
                          />

                          {/* Линия покупки */}
                          <polyline
                            points={purchasePolyline}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Линия текущей стоимости */}
                          <polyline
                            points={currentPolyline}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Точки на линии покупки */}
                          {purchasePoints.map((point, i) => (
                            <circle
                              key={`purchase-point-${i}`}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="#3b82f6"
                              stroke="#1e40af"
                              strokeWidth="1"
                              className="hover:r-5 transition-all cursor-pointer"
                              onMouseEnter={(e) => handlePointHover(e, point, 'purchase')}
                              onMouseLeave={handlePointLeave}
                            />
                          ))}

                          {/* Точки на линии текущей стоимости */}
                          {currentPoints.map((point, i) => (
                            <circle
                              key={`current-point-${i}`}
                              cx={point.x}
                              cy={point.y}
                              r="4"
                              fill="#10b981"
                              stroke="#059669"
                              strokeWidth="1"
                              className="hover:r-5 transition-all cursor-pointer"
                              onMouseEnter={(e) => handlePointHover(e, point, 'current')}
                              onMouseLeave={handlePointLeave}
                            />
                          ))}

                          {/* Подписи оси Y (стоимость) */}
                          {yValues.map((value, i) => {
                            const y = paddingTop + chartHeight - ((value - minValue) / range) * chartHeight;
                            return (
                              <g key={`y-label-${i}`}>
                                <text
                                  x={paddingLeft - 10}
                                  y={y + 4}
                                  textAnchor="end"
                                  fill="rgba(255,255,255,0.6)"
                                  fontSize="10"
                                  className="font-mono"
                                >
                                  {formatValue(value)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Подписи оси X (даты) */}
                          {xIndices.map((idx) => {
                            const x = paddingLeft + (idx / (data.length - 1 || 1)) * chartWidth;
                            const dateStr = data[idx]?.date || '';
                            return (
                              <g key={`x-label-${idx}`}>
                                <text
                                  x={x}
                                  y={height - paddingBottom + 20}
                                  textAnchor="middle"
                                  fill="rgba(255,255,255,0.6)"
                                  fontSize="10"
                                >
                                  {formatDate(dateStr)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-white/60">Стоимость покупки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-white/60">Текущая стоимость</span>
                  </div>
                </div>
              </div>
            )}

            {/* Распределение по статусам */}
            {chartData.statusDistribution && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Распределение по статусам</h3>
                <div className="space-y-4">
                  {Object.values(chartData.statusDistribution).every((v: any) => v === 0) ? (
                    <div className="text-center py-8 text-white/40">
                      <svg className="mx-auto h-12 w-12 text-white/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Нет данных для отображения</p>
                    </div>
                  ) : (
                    <>
                      {Object.entries(chartData.statusDistribution).map(([status, count]: [string, any]) => {
                        const total = Object.values(chartData.statusDistribution).reduce((a: number, b: any) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        const statusLabels: Record<string, string> = {
                          rental: 'В аренде',
                          under_construction: 'В строительстве',
                          closed: 'Закрыто',
                        };
                        const statusColors: Record<string, string> = {
                          rental: 'bg-green-500',
                          under_construction: 'bg-yellow-500',
                          closed: 'bg-gray-500',
                        };
                        return (
                          <div key={status}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white/80">{statusLabels[status] || status}</span>
                              <span className="text-white/60">{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`${statusColors[status]} h-2 rounded-full transition-all`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Топ регионов */}
        {chartData?.topRegions && chartData.topRegions.length > 0 && (
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-sabay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Топ регионов
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {chartData.topRegions.map(({ region, count }: { region: string; count: number }, index: number) => (
                <div key={region} className="text-center bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {index === 0 && (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                    <div className="text-2xl font-bold text-sabay-primary">{count}</div>
                  </div>
                  <div className="text-sm text-white/60">{region}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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
