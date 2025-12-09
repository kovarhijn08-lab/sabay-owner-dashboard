'use client';

import { useState, useEffect } from 'react';
import { managerApi, Expense } from '../../../../../lib/api-client';
import { useToastContext } from '../../../../../components/ToastProvider';
import { DataTable } from '../../../../../components/common/DataTable';
import { FormModal } from '../../../../../components/common/FormModal';

export function ExpensesTab({ propertyId }: { propertyId: string }) {
  const toast = useToastContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    expenseType: '',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    loadExpenses();
  }, [propertyId]);

  async function loadExpenses() {
    try {
      setLoading(true);
      const data = await managerApi.getExpenses(propertyId);
      setExpenses(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки расходов');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingExpense(null);
    setFormData({
      amount: '',
      expenseType: '',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
    });
    setShowModal(true);
  }

  function openEditModal(expense: Expense) {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      expenseType: expense.expenseType,
      expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
      description: expense.description || '',
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      toast.error('Укажите корректную сумму');
      return;
    }

    if (!formData.expenseType.trim()) {
      toast.error('Укажите тип расхода');
      return;
    }

    try {
      const data = {
        amount: parseFloat(formData.amount),
        expenseType: formData.expenseType,
        expenseDate: formData.expenseDate,
        description: formData.description || undefined,
      };

      if (editingExpense) {
        await managerApi.updateExpense(editingExpense.id, data);
        toast.success('Расход изменён');
      } else {
        await managerApi.addExpense(propertyId, data);
        toast.success('Расход добавлен');
      }

      setShowModal(false);
      await loadExpenses();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка сохранения');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить этот расход?')) return;

    try {
      await managerApi.deleteExpense(id);
      toast.success('Расход удалён');
      await loadExpenses();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка удаления');
    }
  }

  const columns = [
    { key: 'expenseDate', label: 'Дата' },
    { key: 'expenseType', label: 'Тип' },
    { key: 'amount', label: 'Сумма' },
    { key: 'description', label: 'Описание' },
    { key: 'actions', label: 'Действия' },
  ];

  const rows = expenses.map((expense) => ({
    id: expense.id,
    expenseDate: new Date(expense.expenseDate).toLocaleDateString('ru-RU'),
    expenseType: expense.expenseType,
    amount: `${expense.amount.toLocaleString('ru-RU')} ₽`,
    description: expense.description ? (expense.description.length > 50 ? expense.description.substring(0, 50) + '...' : expense.description) : '-',
    actions: (
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(expense)}
          className="px-3 py-1 bg-sabay-primary/10 border border-sabay-primary text-sabay-primary rounded-lg hover:bg-sabay-primary/20 transition text-sm"
        >
          Изменить
        </button>
        <button
          onClick={() => handleDelete(expense.id)}
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
        <h3 className="text-lg font-semibold">Расходы</h3>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition text-sm font-medium"
        >
          + Добавить расход
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/60">Загрузка...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-white/60">Нет расходов</div>
      ) : (
        <DataTable columns={columns} rows={rows} />
      )}

      {showModal && (
        <FormModal
          title={editingExpense ? 'Изменить расход' : 'Добавить расход'}
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
              <label className="block text-sm font-medium mb-2">Тип расхода *</label>
              <input
                type="text"
                value={formData.expenseType}
                onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="Cleaning, Maintenance, Commission, Tax"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата *</label>
              <input
                type="date"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                rows={3}
                placeholder="Описание расхода"
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
