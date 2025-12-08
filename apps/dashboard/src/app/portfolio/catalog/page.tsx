'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, catalogApi } from '../../../lib/api-client';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

interface Project {
  id: string;
  name: string;
  region: string;
  city?: string;
  developer?: string | null;
  propertyType?: string | null;
  plannedHandoverDate?: string | null;
}

export default function CatalogPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    loadCatalog();
  }, [router]);

  useEffect(() => {
    filterProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, searchQuery, projects]);

  async function loadCatalog() {
    try {
      setLoading(true);
      const [projectsData, regionsData] = await Promise.all([
        catalogApi.getProjects(),
        catalogApi.getRegions(),
      ]);
      setProjects(projectsData as Project[]);
      setRegions(regionsData as string[]);
    } catch (err: any) {
      console.error('Ошибка загрузки каталога:', err);
      const errorMessage = err?.message || 'Не удалось загрузить каталог проектов';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        router.push('/login');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        toast.error('Не удалось подключиться к серверу. Проверьте подключение');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  function filterProjects() {
    let filtered = [...projects];

    if (selectedRegion) {
      filtered = filtered.filter(p => p.region === selectedRegion);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.region.toLowerCase().includes(query) ||
        (p.developer && p.developer.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Портфель', href: '/portfolio' },
            { label: 'Каталог проектов' },
          ]}
        />

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">Каталог проектов</h1>
            <p className="text-white/60">Просмотр доступных проектов недвижимости</p>
          </div>
          <button
            onClick={() => router.push('/portfolio/properties/new')}
            className="rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20"
          >
            + Создать объект
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white/5 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Поиск</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Название проекта, регион, застройщик..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Регион</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Все регионы</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список проектов */}
        {loading ? (
          <div className="bg-white/5 rounded-lg p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-sabay-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Загрузка каталога...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white/5 rounded-lg p-12 text-center">
            <p className="text-white/60 mb-4">Проекты не найдены</p>
            {(selectedRegion || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedRegion('');
                  setSearchQuery('');
                }}
                className="text-sabay-primary hover:underline"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-sabay-primary/50 transition cursor-pointer"
                onClick={() => router.push(`/portfolio/properties/new?projectId=${project.id}`)}
              >
                <h3 className="text-lg font-semibold mb-2 text-sabay-primary">
                  {project.name}
                </h3>
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.region}</span>
                  </div>
                  {project.developer && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{project.developer}</span>
                    </div>
                  )}
                  {project.plannedHandoverDate && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Сдача: {project.plannedHandoverDate}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/portfolio/properties/new?projectId=${project.id}`);
                    }}
                    className="w-full text-sm text-sabay-primary hover:underline"
                  >
                    Выбрать этот проект →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Статистика */}
        {!loading && (
          <div className="text-center text-white/60 text-sm">
            Показано {filteredProjects.length} из {projects.length} проектов
          </div>
        )}
      </div>
    </div>
  );
}

