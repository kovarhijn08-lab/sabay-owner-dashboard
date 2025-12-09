'use client';

import { useState, useEffect } from 'react';
import { managerApi, Valuation } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';

export function ValuationsTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingValuation, setEditingValuation] = useState<Valuation | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    valuationDate: new Date().toISOString().split('T')[0],
    source: '',
    notes: '',
  });

  useEffect(() => {
    loadValuations();
  }, [propertyId]);

  async function loadValuations() {
    try {
      setLoading(true);
      const data = await managerApi.getValuations(propertyId);
      setValuations(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки оценок');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingValuation(null);
    setFormData({
      value: '',
      valuationDate: new Date().toISOString().split('T')[0],
      source: '',
      notes: '',
    });
    setShowModal(true);
  }

  function openEditModal(valuation: Valuation) {
    setEditingValuation(valuation);
    setFormData({
      value: valuation.value.toString(),
      valuationDate: new Date(valuation.valuationDate).toISOString().split('T')[0],
      source: valuation.source || '',
      notes: valuation.notes || '',
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.value.trim() || parseFloat(formData.value) <= 0) {
      toast.error('Укажите корректную оценку');
      return;
    }

    try {
      const data = {
        value: parseFloat(formData.value),
        valuationDate: formData.valuationDate,
        source: formData.source || undefined,
        notes: formData.notes || undefined,
      };

      if (editingValuation) {
        await managerApi.updateValuation(editingValuation.id, data);
        toast.success('Оценка изменена');
      } else {
        await managerApi.addValuation(propertyId, data);
        toast.success('Оценка добавлена');
      }

      setShowModal(false);
      await loadValuations();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  }

  const columns = [
    { key: 'valuationDate', label: 'Дата' },
    { key: 'value', label: 'Оценка' },
    { key: 'source', label: 'Источник' },
    { key: 'notes', label: 'Примечания' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = valuations.map((valuation) => ({
    id: valuation.id,
    valuationDate: new Date(valuation.valuationDate).toLocaleDateString('ru-RU'),
    value: `${valuation.value.toLocaleString('ru-RU')} ₽`,
    source: valuation.source || '-',
    notes: valuation.notes ? (valuation.notes.length > 50 ? valuation.notes.substring(0, 50) + '...' : valuation.notes) : '-',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(valuation)}
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Изменить
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Оценки стоимости</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Добавить оценку
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : valuations.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет оценок</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title={editingValuation ? 'Изменить оценку' : 'Добавить оценку'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Оценка (₽) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата оценки *</label>
              <input
                type="date"
                value={formData.valuationDate}
                onChange={(e) => setFormData({ ...formData, valuationDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Источник</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Оценщик, платформа"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Примечания</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Дополнительная информация"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
