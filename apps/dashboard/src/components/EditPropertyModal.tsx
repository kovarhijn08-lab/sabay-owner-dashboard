'use client';

import { useState, useEffect } from 'react';
import { OwnerProperty, UpdatePropertyDto, portfolioApi } from '../lib/api-client';

interface EditPropertyModalProps {
  property: OwnerProperty;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Модальное окно для редактирования объекта недвижимости
 */
export default function EditPropertyModal({ property, isOpen, onClose, onSuccess }: EditPropertyModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdatePropertyDto>({
    name: property.name,
    region: property.region,
    currentEstimate: property.currentEstimate || undefined,
    constructionProgress: property.constructionProgress || undefined,
    constructionStage: property.constructionStage || undefined,
    plannedCompletionDate: property.plannedCompletionDate
      ? new Date(property.plannedCompletionDate).toISOString().split('T')[0]
      : undefined,
    expectedAdr: property.expectedAdr || undefined,
    expectedOccupancy: property.expectedOccupancy || undefined,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: property.name,
        region: property.region,
        currentEstimate: property.currentEstimate || undefined,
        constructionProgress: property.constructionProgress || undefined,
        constructionStage: property.constructionStage || undefined,
        plannedCompletionDate: property.plannedCompletionDate
          ? new Date(property.plannedCompletionDate).toISOString().split('T')[0]
          : undefined,
        expectedAdr: property.expectedAdr || undefined,
        expectedOccupancy: property.expectedOccupancy || undefined,
      });
    }
  }, [isOpen, property]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await portfolioApi.updateProperty(property.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Ошибка обновления объекта:', err);
      alert('Ошибка обновления объекта. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Редактировать объект</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Район *</label>
              <input
                type="text"
                required
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
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
                  setFormData({ ...formData, currentEstimate: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
              />
            </div>
          </div>

          {/* Данные для стройки */}
          {property.status === 'under_construction' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Данные для стройки</h3>

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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Текущий этап</label>
                <input
                  type="text"
                  value={formData.constructionStage || ''}
                  onChange={(e) => setFormData({ ...formData, constructionStage: e.target.value || undefined })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                  placeholder="Например: Отделочные работы"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Плановая дата завершения</label>
                <input
                  type="date"
                  value={formData.plannedCompletionDate || ''}
                  onChange={(e) => setFormData({ ...formData, plannedCompletionDate: e.target.value || undefined })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                />
              </div>
            </div>
          )}

          {/* Данные для аренды */}
          {property.status === 'rental' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Данные для аренды</h3>

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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
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
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                />
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl border border-sabay-primary bg-sabay-primary/10 px-6 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

