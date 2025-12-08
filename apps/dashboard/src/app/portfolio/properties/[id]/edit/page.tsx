'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { portfolioApi, authApi, OwnerProperty, UpdatePropertyDto } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { StickyActions } from '../../../../../components/StickyActions';
import { Breadcrumbs } from '../../../../../components/common/Breadcrumbs';

/**
 * Страница редактирования объекта недвижимости
 */
export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const toast = useToastContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [formData, setFormData] = useState<UpdatePropertyDto>({});

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/login');
      return;
    }

    loadProperty();
  }, [router, id]);

  async function loadProperty() {
    try {
      const data = await portfolioApi.getProperty(id);
      setProperty(data);
      setFormData({
        name: data.name,
        region: data.region,
        purchaseDate: data.purchaseDate || undefined,
        currentEstimate: data.currentEstimate || undefined,
        constructionProgress: data.constructionProgress || undefined,
        constructionStage: data.constructionStage || undefined,
        plannedCompletionDate: data.plannedCompletionDate || undefined,
        expectedAdr: data.expectedAdr || undefined,
        expectedOccupancy: data.expectedOccupancy || undefined,
      });
    } catch (err: any) {
      console.error('Ошибка загрузки объекта:', err);
      const errorMessage = err?.message || 'Ошибка загрузки объекта';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await portfolioApi.updateProperty(id, formData);
      toast.success('Объект успешно обновлен!');
      router.push(`/portfolio/properties/${id}`);
    } catch (err: any) {
      console.error('Ошибка обновления объекта:', err);
      const errorMessage = err?.message || 'Ошибка обновления объекта. Попробуйте снова.';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        router.push('/login');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        toast.error('Не удалось подключиться к серверу. Проверьте подключение');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-6 bg-white/10 rounded animate-pulse w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="h-4 bg-white/10 rounded animate-pulse mb-4 w-32"></div>
                <div className="h-12 bg-white/10 rounded animate-pulse"></div>
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
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Портфель', href: '/portfolio' },
            { label: 'Объекты', href: '/portfolio/properties' },
            { label: 'Редактирование' },
          ]} />
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center mt-6">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Объект не найден</h3>
            <p className="text-white/60 mb-4">Объект с указанным ID не существует или был удален.</p>
            <button
              onClick={() => router.push('/portfolio/properties')}
              className="px-4 py-2 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition"
            >
              Вернуться к списку объектов
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Форматирование цены
  const formatPrice = (value: string | number | undefined) => {
    if (!value) return '';
    const num = typeof value === 'string' ? value.replace(/\s/g, '') : value.toString();
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const parsePrice = (value: string) => {
    return value.replace(/\s/g, '');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'currentEstimate' | 'expectedAdr') => {
    const rawValue = e.target.value;
    const cleanedValue = rawValue.replace(/[^\d\s]/g, '');
    setFormData({
      ...formData,
      [field]: cleanedValue ? parseFloat(parsePrice(cleanedValue)) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6 pb-32 md:pb-6">
        <Breadcrumbs items={[
          { label: 'Портфель', href: '/portfolio' },
          { label: 'Объекты', href: '/portfolio/properties' },
          { label: property.name, href: `/portfolio/properties/${id}` },
          { label: 'Редактирование' },
        ]} />
        
        <header>
          <h1 className="text-3xl font-bold mb-2">Редактировать объект</h1>
          <p className="text-white/60">{property.name}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Основная информация</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Название проекта / юнита *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Район *</label>
              <input
                type="text"
                required
                value={formData.region || ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата покупки</label>
              <input
                type="date"
                value={formData.purchaseDate || ''}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value || undefined })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Текущая оценочная стоимость (₽)</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatPrice(formData.currentEstimate?.toString())}
                  onChange={(e) => handlePriceChange(e, 'currentEstimate')}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px] text-lg font-mono"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">₽</span>
              </div>
              <p className="text-xs text-white/50 mt-1">Разделители тысяч добавятся автоматически</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <select
                value={formData.status || property.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
              >
                <option value="under_construction">В строительстве</option>
                <option value="rental">В аренде</option>
                <option value="closed">Закрыто</option>
              </select>
            </div>
          </div>

          {/* Данные для стройки */}
          {property.status === 'under_construction' && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">Данные для стройки</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Процент готовности (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.constructionProgress || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      constructionProgress: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Текущий этап</label>
                <input
                  type="text"
                  value={formData.constructionStage || ''}
                  onChange={(e) => setFormData({ ...formData, constructionStage: e.target.value || undefined })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                  placeholder="Например: Фундамент, Стены, Отделка"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Плановая дата завершения</label>
                <input
                  type="date"
                  value={formData.plannedCompletionDate || ''}
                  onChange={(e) => setFormData({ ...formData, plannedCompletionDate: e.target.value || undefined })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                />
              </div>
            </div>
          )}

          {/* Данные для аренды */}
          {property.status === 'rental' && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">Данные для аренды</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Ожидаемый ADR (₽/ночь)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatPrice(formData.expectedAdr?.toString())}
                    onChange={(e) => handlePriceChange(e, 'expectedAdr')}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px] font-mono"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">₽</span>
                </div>
                <p className="text-xs text-white/50 mt-1">Средняя дневная ставка аренды</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ожидаемая занятость (0-100%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.expectedOccupancy || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedOccupancy: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {/* Кнопки - десктоп версия */}
          <div className="hidden md:flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10 active:bg-white/15 min-h-[44px]"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20 active:bg-sabay-primary/30 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Сохранение...</span>
                </>
              ) : (
                'Сохранить изменения'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Липкие кнопки для мобильных */}
      <StickyActions>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-base font-medium transition active:bg-white/10 min-h-[48px]"
          >
            Отмена
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector('form');
              if (form) {
                form.requestSubmit();
              }
            }}
            disabled={saving}
            className="flex-1 rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-base font-medium text-sabay-primary transition active:bg-sabay-primary/20 disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
          >
            {saving ? (
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
        </StickyActions>
    </div>
  );
}

