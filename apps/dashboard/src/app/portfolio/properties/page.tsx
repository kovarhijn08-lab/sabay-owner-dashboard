'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, portfolioApi } from '../../../lib/api-client';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function PortfolioPropertiesPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'region' | 'purchasePrice' | 'currentEstimate' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  // Загрузка сохраненных фильтров из localStorage
  useEffect(() => {
    const savedStatusFilter = localStorage.getItem('properties-status-filter');
    const savedSortBy = localStorage.getItem('properties-sort-by');
    const savedSortOrder = localStorage.getItem('properties-sort-order');
    const savedItemsPerPage = localStorage.getItem('properties-items-per-page');
    
    if (savedStatusFilter) setStatusFilter(savedStatusFilter);
    if (savedSortBy) setSortBy(savedSortBy as any);
    if (savedSortOrder) setSortOrder(savedSortOrder as 'asc' | 'desc');
    if (savedItemsPerPage) setItemsPerPage(parseInt(savedItemsPerPage, 10));
  }, []);

  // Сохранение фильтров в localStorage
  useEffect(() => {
    localStorage.setItem('properties-status-filter', statusFilter);
    localStorage.setItem('properties-sort-by', sortBy);
    localStorage.setItem('properties-sort-order', sortOrder);
    localStorage.setItem('properties-items-per-page', itemsPerPage.toString());
  }, [statusFilter, sortBy, sortOrder, itemsPerPage]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await portfolioApi.getProperties();
      setProperties(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  // Фильтрация и сортировка
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = [...properties];

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.region?.toLowerCase().includes(query)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'purchasePrice' || sortBy === 'currentEstimate') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortBy === 'createdAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [properties, searchQuery, statusFilter, sortBy, sortOrder]);

  // Пагинация
  const totalPages = Math.ceil(filteredAndSortedProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProperties.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProperties, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  const handleSort = useCallback((field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const getRiskColor = useCallback((risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'high': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    const labels: Record<string, string> = {
      rental: 'В аренде',
      under_construction: 'В строительстве',
      closed: 'Закрыто',
    };
    return labels[status] || status;
  }, []);

  const getMainKPI = useCallback((property: any) => {
    if (property.currentEstimate && property.purchasePrice) {
      const roi = ((property.currentEstimate - property.purchasePrice) / property.purchasePrice) * 100;
      return `ROI: ${roi > 0 ? '+' : ''}${roi.toFixed(1)}%`;
    }
    return null;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs items={[{ label: 'Портфель', href: '/portfolio' }, { label: 'Объекты' }]} />
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Мои объекты</h1>
            <p className="text-white/60">Список всех объектов недвижимости</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/portfolio/properties/new')}
              className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
            >
              + Создать объект
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

        {/* Фильтры и поиск */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Поиск */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или региону..."
                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Фильтр по статусу */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
            >
              <option value="all">Все статусы</option>
              <option value="rental">В аренде</option>
              <option value="under_construction">В строительстве</option>
              <option value="closed">Закрыто</option>
            </select>

            {/* Количество на странице */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
            >
              <option value="10">10 на странице</option>
              <option value="25">25 на странице</option>
              <option value="50">50 на странице</option>
              <option value="100">100 на странице</option>
            </select>
          </div>
        </div>

        {/* Таблица */}
        {loading ? (
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : paginatedProperties.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-12 text-center border border-white/10">
            <svg className="mx-auto h-12 w-12 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">Объекты не найдены</h3>
            <p className="text-white/60 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Попробуйте изменить фильтры поиска' 
                : 'Начните с создания первого объекта'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => router.push('/portfolio/properties/new')}
                className="inline-flex items-center rounded-md border border-transparent bg-sabay-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sabay-primary/90"
              >
                + Создать первый объект
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-2 hover:text-white transition"
                        >
                          Название
                          {sortBy === 'name' && (
                            <svg className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('region')}
                          className="flex items-center gap-2 hover:text-white transition"
                        >
                          Регион
                          {sortBy === 'region' && (
                            <svg className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('purchasePrice')}
                          className="flex items-center gap-2 hover:text-white transition"
                        >
                          Цена покупки
                          {sortBy === 'purchasePrice' && (
                            <svg className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('currentEstimate')}
                          className="flex items-center gap-2 hover:text-white transition"
                        >
                          Текущая оценка
                          {sortBy === 'currentEstimate' && (
                            <svg className={`w-4 h-4 ${sortOrder === 'asc' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                        ROI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {paginatedProperties.map((property) => {
                      const roi = property.currentEstimate && property.purchasePrice
                        ? ((property.currentEstimate - property.purchasePrice) / property.purchasePrice) * 100
                        : null;
                      return (
                        <tr key={property.id} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/portfolio/properties/${property.id}`}
                              className="font-medium text-sabay-primary hover:underline"
                            >
                              {property.name || '-'}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/80">
                            {property.region || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={property.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/80">
                            {property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/80">
                            {property.currentEstimate ? `${property.currentEstimate.toLocaleString('ru-RU')} ₽` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {roi !== null ? (
                              <span className={roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : ''}>
                                {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-white/40">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-white/60">
                  Показано {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProperties.length)} из {filteredAndSortedProperties.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
                  >
                    Назад
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            currentPage === pageNum
                              ? 'bg-sabay-primary text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
