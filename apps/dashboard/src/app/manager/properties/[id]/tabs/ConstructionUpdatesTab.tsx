'use client';

import { useState, useEffect } from 'react';
import { managerApi, ConstructionUpdate } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';
import { StatusBadge } from '../../../../../components/common/StatusBadge';

export function ConstructionUpdatesTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [updates, setUpdates] = useState<ConstructionUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<ConstructionUpdate | null>(null);
  const [formData, setFormData] = useState({
    progress: '',
    stage: '',
    updateDate: new Date().toISOString().split('T')[0],
    description: '',
    photos: [] as string[],
    reasonForDecrease: '',
  });
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    loadUpdates();
  }, [propertyId]);

  async function loadUpdates() {
    try {
      setLoading(true);
      const data = await managerApi.getConstructionUpdates(propertyId);
      setUpdates(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки обновлений');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingUpdate(null);
    setFormData({
      progress: '',
      stage: '',
      updateDate: new Date().toISOString().split('T')[0],
      description: '',
      photos: [],
      reasonForDecrease: '',
    });
    setShowModal(true);
  }

  function openEditModal(update: ConstructionUpdate) {
    setEditingUpdate(update);
    setFormData({
      progress: update.progress?.toString() || '',
      stage: update.stage || '',
      updateDate: update.updateDate ? new Date(update.updateDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: update.description || '',
      photos: update.photos || [],
      reasonForDecrease: '',
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.progress.trim() && !formData.stage.trim()) {
      toast.error('Укажите хотя бы прогресс или этап');
      return;
    }

    const progress = formData.progress.trim() ? parseInt(formData.progress, 10) : undefined;
    
    // Проверка уменьшения прогресса
    if (progress !== undefined && editingUpdate) {
      const lastProgress = editingUpdate.progress;
      if (lastProgress !== null && progress < lastProgress) {
        setPendingSubmit(true);
        setShowReasonModal(true);
        return;
      }
    }

    await submitUpdate(progress);
  }

  async function submitUpdate(progress?: number, reason?: string) {
    try {
      const data: any = {
        updateDate: formData.updateDate,
        description: formData.description || undefined,
        photos: formData.photos.length > 0 ? formData.photos : undefined,
      };

      if (progress !== undefined) {
        data.progress = progress;
      }
      if (formData.stage.trim()) {
        data.stage = formData.stage;
      }
      if (reason) {
        data.reasonForDecrease = reason;
      }

      if (editingUpdate) {
        await managerApi.updateConstructionUpdate(editingUpdate.id, data);
        toast.success('Обновление изменено');
      } else {
        await managerApi.addConstructionUpdate(propertyId, data);
        toast.success('Обновление добавлено');
      }

      setShowModal(false);
      setShowReasonModal(false);
      setPendingSubmit(false);
      await loadUpdates();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить это обновление?')) return;

    try {
      await managerApi.deleteConstructionUpdate(id);
      toast.success('Обновление удалено');
      await loadUpdates();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка удаления');
    }
  }

  const columns = [
    { key: 'updateDate', label: 'Дата' },
    { key: 'progress', label: 'Прогресс' },
    { key: 'stage', label: 'Этап' },
    { key: 'description', label: 'Описание' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = updates.map((update) => ({
    id: update.id,
    updateDate: update.updateDate ? new Date(update.updateDate).toLocaleDateString('ru-RU') : '-',
    progress: update.progress !== null ? `${update.progress}%` : '-',
    stage: update.stage || '-',
    description: update.description ? (update.description.length > 50 ? update.description.substring(0, 50) + '...' : update.description) : '-',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(update)}
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Изменить
        </button>
        <button
          onClick={() => handleDelete(update.id)}
          className="px-3 py-1 bg-red-500/10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition text-sm"
        >
          Удалить
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Обновления стройки</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Добавить обновление
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : updates.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет обновлений</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title={editingUpdate ? 'Изменить обновление' : 'Добавить обновление'}
          onClose={() => {
            setShowModal(false);
            setPendingSubmit(false);
          }}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Прогресс (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="0-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Этап</label>
              <input
                type="text"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Например: Фундамент"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата обновления</label>
              <input
                type="date"
                value={formData.updateDate}
                onChange={(e) => setFormData({ ...formData, updateDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Описание обновления"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Фотографии (URL, максимум 3)</label>
              <input
                type="text"
                value={formData.photos.join(', ')}
                onChange={(e) => {
                  const photos = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                  if (photos.length <= 3) {
                    setFormData({ ...formData, photos });
                  } else {
                    toast.error('Максимум 3 фотографии');
                  }
                }}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="URL1, URL2, URL3"
              />
              <p className="text-xs text-white/50 mt-1">Введите URL фотографий через запятую</p>
            </div>
          </div>
        </FormModal>
      )}

      {showReasonModal && (
        <FormModal
          title="Причина уменьшения прогресса"
          onClose={() => {
            setShowReasonModal(false);
            setPendingSubmit(false);
          }}
          onSubmit={async () => {
            const reason = formData.reasonForDecrease.trim();
            if (reason.length < 10) {
              toast.error('Причина должна содержать минимум 10 символов');
              return;
            }
            const progress = formData.progress.trim() ? parseInt(formData.progress, 10) : undefined;
            await submitUpdate(progress, reason);
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-2">Причина уменьшения прогресса *</label>
            <textarea
              value={formData.reasonForDecrease}
              onChange={(e) => setFormData({ ...formData, reasonForDecrease: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows={4}
              placeholder="Укажите причину уменьшения прогресса (минимум 10 символов)"
              required
            />
            <p className="text-xs text-white/50 mt-1">Минимум 10 символов</p>
          </div>
        </FormModal>
      )}
    </div>
  );
}
