'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, portfolioApi, catalogApi } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../../components/ToastProvider';

interface Project {
  id: string;
  name: string;
  region: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const toast = useToastContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [projectRegionFilter, setProjectRegionFilter] = useState<string>('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    unitNumber: '',
    purchasePrice: '',
    purchaseDate: '',
    projectId: '',
  });

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
    }

    if (showProjectDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProjectDropdown]);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    loadCatalogData();
  }, [router]);

  async function loadCatalogData() {
    try {
      setLoadingCatalog(true);
      console.log('[NewPropertyPage] Загрузка каталога...');
      const [projectsData, regionsData] = await Promise.all([
        catalogApi.getProjects(),
        catalogApi.getRegions(),
      ]);
      console.log('[NewPropertyPage] Проекты загружены:', projectsData?.length || 0);
      console.log('[NewPropertyPage] Регионы загружены:', regionsData?.length || 0);
      
      if (!projectsData || projectsData.length === 0) {
        console.warn('[NewPropertyPage] Проекты не загружены или пустой массив');
        toast.error('Проекты не найдены. Проверьте подключение к серверу.');
      }
      
      setProjects(projectsData as Project[] || []);
      setRegions(regionsData as string[] || []);
    } catch (err: any) {
      console.error('[NewPropertyPage] Ошибка загрузки каталога:', err);
      toast.error(`Не удалось загрузить каталог проектов: ${err?.message || 'Неизвестная ошибка'}`);
      setProjects([]);
      setRegions([]);
    } finally {
      setLoadingCatalog(false);
    }
  }

  async function handleProjectChange(projectId: string) {
    setFormData(prev => ({ ...prev, projectId }));
    setShowProjectDropdown(false);
    setProjectSearchQuery('');

    if (projectId) {
      // Автозаполнение названия и региона из проекта
      const selectedProject = projects.find(p => p.id === projectId);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          projectId,
          name: selectedProject.name,
          region: selectedProject.region,
        }));
      }
    }
  }

  // Фильтрация проектов
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = !projectSearchQuery || 
      project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      project.region.toLowerCase().includes(projectSearchQuery.toLowerCase());
    const matchesRegion = !projectRegionFilter || project.region === projectRegionFilter;
    return matchesSearch && matchesRegion;
  });

  const selectedProject = projects.find(p => p.id === formData.projectId);

  // Функции для форматирования цены
  const formatPrice = (value: string): string => {
    // Убираем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    // Форматируем с пробелами как разделителями тысяч
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const parsePrice = (value: string): string => {
    // Убираем все пробелы и возвращаем только цифры
    return value.replace(/\s/g, '');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPrice(rawValue);
    setFormData(prev => ({ ...prev, purchasePrice: formatted }));
  };

  // Обработка projectId из URL после загрузки каталога
  useEffect(() => {
    if (!loadingCatalog && projects.length > 0 && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const projectIdFromUrl = urlParams.get('projectId');
      if (projectIdFromUrl && !formData.projectId) {
        handleProjectChange(projectIdFromUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCatalog, projects.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.name.trim()) {
      toast.error('Введите название объекта');
      return;
    }
    
    if (!formData.region.trim()) {
      toast.error('Выберите или введите регион');
      return;
    }
    
    if (!formData.unitNumber.trim()) {
      toast.error('Введите номер квартиры/юнита');
      return;
    }
    
    const priceValue = parsePrice(formData.purchasePrice);
    const price = parseFloat(priceValue);
    if (isNaN(price) || price <= 0) {
      toast.error('Введите корректную цену покупки (больше 0)');
      return;
    }
    
    // Проверка даты покупки (не должна быть в будущем)
    if (formData.purchaseDate) {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (purchaseDate > today) {
        toast.error('Дата покупки не может быть в будущем');
        return;
      }
    }
    
    setLoading(true);
    try {
      await portfolioApi.createProperty({
        name: formData.name.trim(),
        region: formData.region.trim(),
        unitNumber: formData.unitNumber.trim(),
        purchasePrice: price, // Уже распарсено без пробелов
        purchaseDate: formData.purchaseDate || undefined,
        projectId: formData.projectId || undefined,
      });
      toast.success('Объект создан успешно');
      router.push('/portfolio');
    } catch (err: any) {
      console.error('Ошибка создания объекта:', err);
      const errorMessage = err?.message || 'Ошибка создания объекта';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        router.push('/login');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        toast.error('Не удалось подключиться к серверу. Проверьте подключение к интернету');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Портфель', href: '/portfolio' },
            { label: 'Объекты', href: '/portfolio/properties' },
            { label: 'Новый объект' },
          ]}
        />
            <div>
          <h1 className="text-3xl font-bold mb-2">Добавить объект</h1>
          <p className="text-white/60">Создание нового объекта недвижимости</p>
        </div>
        {loadingCatalog ? (
          <div className="bg-white/5 rounded-lg p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-sabay-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Загрузка каталога...</p>
            </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-6 space-y-6">
            {/* Выбор из каталога (опционально) */}
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-lg font-semibold mb-2">Выбор из каталога (опционально)</h2>
              <p className="text-sm text-white/60 mb-4">
                Выберите проект из каталога, чтобы автоматически заполнить название и регион
              </p>
              
              <div className="space-y-3">
                {/* Выбранный проект или кнопка выбора */}
            <div>
                  <label className="block text-sm font-medium mb-2">
                    Проект
                    <span className="text-white/40 text-xs ml-2 font-normal">(автозаполнит название и регион)</span>
                  </label>
                  
                  {selectedProject ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        <div className="font-medium">{selectedProject.name}</div>
                        <div className="text-sm text-white/60">{selectedProject.region}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, projectId: '', name: '', region: '' }));
                          setProjectSearchQuery('');
                          setProjectRegionFilter('');
                        }}
                        className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition"
                        title="Очистить выбор"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:border-white/30 transition focus:outline-none focus:ring-2 focus:ring-sabay-primary text-left flex items-center justify-between"
                        disabled={loadingCatalog}
                      >
                        <span className={loadingCatalog ? 'text-white/60' : ''}>
                          {loadingCatalog ? 'Загрузка проектов...' : 'Выберите проект из каталога'}
                        </span>
                        <svg 
                          className={`w-5 h-5 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown с фильтрами */}
                      {showProjectDropdown && !loadingCatalog && (
                        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/20 rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col">
                          {/* Фильтры */}
                          <div className="p-3 border-b border-white/10 space-y-2">
                            {/* Поиск */}
                            <div className="relative">
              <input
                type="text"
                                value={projectSearchQuery}
                                onChange={(e) => setProjectSearchQuery(e.target.value)}
                                placeholder="Поиск по названию или региону..."
                                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                                autoFocus
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

                            {/* Фильтр по региону */}
                            {regions.length > 0 && (
              <select
                                value={projectRegionFilter}
                                onChange={(e) => setProjectRegionFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                              >
                                <option value="">Все регионы</option>
                                {regions.map((region) => (
                                  <option key={region} value={region}>
                                    {region}
                                  </option>
                                ))}
              </select>
                            )}
            </div>

                          {/* Список проектов */}
                          <div className="overflow-y-auto flex-1">
                            {filteredProjects.length > 0 ? (
                              <div className="divide-y divide-white/10">
                                {filteredProjects.map((project) => (
                                  <button
                                    key={project.id}
                                    type="button"
                                    onClick={() => handleProjectChange(project.id)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition focus:outline-none focus:bg-white/5"
                                  >
                                    <div className="font-medium text-white">{project.name}</div>
                                    <div className="text-sm text-white/60">{project.region}</div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-8 text-center text-white/60">
                                <p>Проекты не найдены</p>
                                {(projectSearchQuery || projectRegionFilter) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProjectSearchQuery('');
                                      setProjectRegionFilter('');
                                    }}
                                    className="mt-2 text-sm text-sabay-primary hover:underline"
                                  >
                                    Сбросить фильтры
                                  </button>
                                )}
                              </div>
                            )}
            </div>

                          {/* Футер с количеством */}
                          <div className="px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-white/60">
                            Показано: {filteredProjects.length} из {projects.length}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
          </div>

            {/* Основная информация */}
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold mb-2">Основная информация</h2>
                <p className="text-sm text-white/60">Заполните обязательные поля для создания объекта</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Название объекта <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary transition"
                    placeholder="Например: Апартаменты в Банг Тао"
                    required
                    aria-required="true"
                  />
                  <p className="text-xs text-white/50 mt-1">Название проекта или объекта недвижимости</p>
              </div>

              <div>
                  <label className="block text-sm font-medium mb-2">
                    Регион <span className="text-red-400">*</span>
                  </label>
                  {regions.length > 0 ? (
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:border-white/30 transition focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                      required
                      aria-required="true"
                    >
                      <option value="">Выберите регион</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  ) : (
                <input
                  type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary transition"
                      placeholder="Введите регион вручную"
                      required
                      aria-required="true"
                    />
                  )}
              </div>

              <div>
                  <label className="block text-sm font-medium mb-2">
                    Номер квартиры/юнита <span className="text-red-400">*</span>
                  </label>
                <input
                    type="text"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary transition"
                    placeholder="Например: A-101, 205, Villa-5"
                    required
                    aria-required="true"
                  />
                  <p className="text-xs text-white/50 mt-1">Уникальный номер квартиры, апартамента или виллы</p>
            </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Цена покупки (₽) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.purchasePrice}
                      onChange={handlePriceChange}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary transition font-mono text-lg"
                      placeholder="0"
                      required
                      aria-required="true"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 font-medium">₽</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    Введите сумму, разделители тысяч добавятся автоматически
                  </p>
                </div>

              <div>
                  <label className="block text-sm font-medium mb-2">
                    Дата покупки
                    <span className="text-white/40 text-xs ml-2 font-normal">(опционально)</span>
                  </label>
                <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60">
                <span className="text-red-400">*</span> — обязательные поля
              </p>
              <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
                  className="px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition font-medium min-h-[44px]"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
                  className="px-6 py-3 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[44px] flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Создание...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Создать объект</span>
                    </>
                  )}
            </button>
              </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
