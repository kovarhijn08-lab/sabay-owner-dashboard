'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { portfolioApi, authApi, OwnerProperty, UpdatePropertyDto } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { StickyActions } from '../../../../../components/StickyActions';

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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-white/60">Загрузка...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-red-400">Объект не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-2xl px-4 py-8 pb-32 md:pb-8">
        <header className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-white/60 mb-4 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
          >
            ← Назад
          </button>
          <h1 className="text-3xl font-semibold mb-2">Редактировать объект</h1>
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
              <label className="block text-sm font-medium mb-2">Текущая оценочная стоимость (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.currentEstimate || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentEstimate: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                placeholder="0.00"
              />
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
                <label className="block text-sm font-medium mb-2">Ожидаемый ADR (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.expectedAdr || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedAdr: e.target.value ? parseFloat(e.target.value) : undefined })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
                  placeholder="0.00"
                />
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
      </main>
    </div>
  );
}

