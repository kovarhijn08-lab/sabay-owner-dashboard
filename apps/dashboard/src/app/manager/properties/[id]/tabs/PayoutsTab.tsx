'use client';

import { useState, useEffect } from 'react';
import { managerApi, Payout } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';
import { StatusBadge } from '../../../../../components/common/StatusBadge';

export function PayoutsTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayout, setEditingPayout] = useState<Payout | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    payoutDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    description: '',
    status: 'planned' as 'planned' | 'paid' | 'delayed',
  });

  useEffect(() => {
    loadPayouts();
  }, [propertyId]);

  async function loadPayouts() {
    try {
      setLoading(true);
      const data = await managerApi.getPayouts(propertyId);
      setPayouts(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки выплат');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingPayout(null);
    setFormData({
      amount: '',
      payoutDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      description: '',
      status: 'planned',
    });
    setShowModal(true);
  }

  function openEditModal(payout: Payout) {
    setEditingPayout(payout);
    setFormData({
      amount: payout.amount.toString(),
      payoutDate: payout.payoutDate ? new Date(payout.payoutDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: payout.paymentMethod || '',
      description: payout.description || '',
      status: payout.status,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      toast.error('Укажите корректную сумму');
      return;
    }

    try {
      const data: any = {
        amount: parseFloat(formData.amount),
        payoutDate: formData.payoutDate,
        paymentMethod: formData.paymentMethod || undefined,
        description: formData.description || undefined,
      };

      if (editingPayout) {
        data.status = formData.status;
        await managerApi.updatePayout(editingPayout.id, data);
        toast.success('Выплата изменена');
      } else {
        await managerApi.createPayout(propertyId, data);
        toast.success('Выплата создана');
      }

      setShowModal(false);
      await loadPayouts();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить эту выплату?')) return;

    try {
      await managerApi.deletePayout(id);
      toast.success('Выплата удалена');
      await loadPayouts();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка удаления');
    }
  }

  const columns = [
    { key: 'periodTo', label: 'Период до' },
    { key: 'amount', label: 'Сумма' },
    { key: 'status', label: 'Статус' },
    { key: 'payoutDate', label: 'Дата выплаты' },
    { key: 'paymentMethod', label: 'Способ оплаты' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = payouts.map((payout) => ({
    id: payout.id,
    periodTo: new Date(payout.periodTo).toLocaleDateString('ru-RU'),
    amount: `${payout.amount.toLocaleString('ru-RU')} ₽`,
    status: <StatusBadge status={payout.status} />,
    payoutDate: payout.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('ru-RU') : '-',
    paymentMethod: payout.paymentMethod || '-',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(payout)}
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Изменить
        </button>
        <button
          onClick={() => handleDelete(payout.id)}
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
        <h3 className="text-lg font-semibold">Выплаты</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Создать выплату
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : payouts.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет выплат</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title={editingPayout ? 'Изменить выплату' : 'Создать выплату'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Сумма (₽) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата выплаты *</label>
              <input
                type="date"
                value={formData.payoutDate}
                onChange={(e) => setFormData({ ...formData, payoutDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            {editingPayout && (
              <div>
                <label className="block text-sm font-medium mb-2">Статус</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'planned' | 'paid' | 'delayed' })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="planned">Запланировано</option>
                  <option value="paid">Оплачено</option>
                  <option value="delayed">Задержано</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Способ оплаты</label>
              <input
                type="text"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Банковский перевод, карта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Описание выплаты"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
