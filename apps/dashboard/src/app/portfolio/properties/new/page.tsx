'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, portfolioApi, catalogApi } from '../../../../lib/api-client';
import { Breadcrumbs } from '../../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../../components/ToastProvider';

interface Project {
  id: string;
  name: string;
  region: string;
}

interface Unit {
  id: string;
  unitNumber: string;
  building?: string | null;
  floor?: number | null;
  area?: number | null;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [loading, setLoading] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    purchasePrice: '',
    purchaseDate: '',
    projectId: '',
    unitId: '',
  });

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
      const [projectsData, regionsData] = await Promise.all([
        catalogApi.getProjects(),
        catalogApi.getRegions(),
      ]);
      setProjects(projectsData as Project[]);
      setRegions(regionsData as string[]);
    } catch (err: any) {
      console.error('Ошибка загрузки каталога:', err);
      toast.error('Не удалось загрузить каталог проектов');
    } finally {
      setLoadingCatalog(false);
    }
  }

  async function handleProjectChange(projectId: string) {
    setFormData(prev => ({ ...prev, projectId, unitId: '' }));
    setUnits([]);

    if (projectId) {
      try {
        const projectUnits = await catalogApi.getUnitsByProject(projectId);
        setUnits(projectUnits as Unit[]);
        
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
      } catch (err: any) {
        console.error('Ошибка загрузки юнитов:', err);
        toast.error('Не удалось загрузить юниты проекта');
      }
    }
  }

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
    
    const price = parseFloat(formData.purchasePrice);
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
        purchasePrice: price,
        purchaseDate: formData.purchaseDate || undefined,
        projectId: formData.projectId || undefined,
        unitId: formData.unitId || undefined,
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
            {/* Выбор из каталога */}
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-lg font-semibold mb-4">Выбор из каталога (опционально)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Проект
                    <span className="text-white/40 text-xs ml-2">(автозаполнит название и регион)</span>
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="">Не выбран (создать новый объект)</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.region}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.projectId && units.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Юнит</label>
                    <select
                      value={formData.unitId}
                      onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option value="">Не выбран</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unitNumber}
                          {unit.building && ` (${unit.building})`}
                          {unit.floor && ` - этаж ${unit.floor}`}
                          {unit.area && ` - ${unit.area} м²`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.projectId && units.length === 0 && (
                  <p className="text-sm text-white/60">В этом проекте нет доступных юнитов</p>
                )}
              </div>
            </div>

            {/* Основная информация */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Основная информация</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
                  placeholder="Название проекта или объекта"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Регион</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  required
                >
                  <option value="">Выберите регион</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {regions.length === 0 && (
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white mt-2"
                    placeholder="Введите регион вручную"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цена покупки (₽)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Дата покупки</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Создание...' : 'Создать объект'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
