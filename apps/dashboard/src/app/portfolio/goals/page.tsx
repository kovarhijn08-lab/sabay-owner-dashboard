'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioApi, PortfolioGoal, PortfolioForecasts, CreateGoalDto, OwnerProperty } from '../../../lib/api-client';
import { useToastContext } from '../../../components/ToastProvider';

const GOAL_TYPE_LABELS: Record<PortfolioGoal['goalType'], string> = {
  roi: 'ROI (%)',
  yearly_income: 'Годовой доход ($)',
  properties_count: 'Количество объектов',
  portfolio_value: 'Стоимость портфеля ($)',
  value_growth: 'Прирост стоимости ($)',
};

export default function GoalsPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [goals, setGoals] = useState<PortfolioGoal[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<PortfolioGoal[]>([]);
  const [forecasts, setForecasts] = useState<PortfolioForecasts | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [properties, setProperties] = useState<Array<{ id: string; name: string }>>([]);
  const [newGoal, setNewGoal] = useState<CreateGoalDto>({
    goalType: 'yearly_income',
    targetValue: 0,
  });
  const [deleteConfirmGoalId, setDeleteConfirmGoalId] = useState<string | null>(null);
  const [archiveConfirmGoalId, setArchiveConfirmGoalId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<PortfolioGoal | null>(null);
  const [editForm, setEditForm] = useState<{ targetValue: number; targetDate?: string; periodFrom?: string; periodTo?: string; description?: string }>({
    targetValue: 0,
  });

  useEffect(() => {
    loadProperties();
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedPropertyId]);

  async function loadProperties() {
    try {
      const propertiesData = await portfolioApi.getProperties();
      setProperties(propertiesData.map(p => ({ id: p.id, name: p.name || `Объект ${p.id.slice(0, 8)}` })));
    } catch (err: any) {
      console.error('Ошибка загрузки объектов:', err);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      const [goalsData, archivedData, forecastsData] = await Promise.all([
        portfolioApi.getActiveGoals(selectedPropertyId || undefined),
        portfolioApi.getArchivedGoals(selectedPropertyId || undefined).catch(() => []),
        portfolioApi.getForecasts().catch(() => null),
      ]);
      setGoals(goalsData);
      setArchivedGoals(archivedData || []);
      setForecasts(forecastsData);
    } catch (err: any) {
      console.error('Ошибка загрузки целей и прогнозов:', err);
      toast.error('Не удалось загрузить цели и прогнозы');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGoal() {
    // Валидация формы
    if (!newGoal.targetValue || newGoal.targetValue <= 0) {
      toast.error('Введите целевое значение (больше 0)');
      return;
    }

    // Проверка дат периода
    if (newGoal.periodFrom && newGoal.periodTo) {
      const from = new Date(newGoal.periodFrom);
      const to = new Date(newGoal.periodTo);
      if (from > to) {
        toast.error('Дата начала периода не может быть позже даты окончания');
        return;
      }
    }

    // Проверка целевой даты
    if (newGoal.targetDate) {
      const targetDate = new Date(newGoal.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (targetDate < today) {
        toast.error('Целевая дата не может быть в прошлом');
        return;
      }
    }

    try {
      const goalToCreate = selectedPropertyId ? { ...newGoal, propertyId: selectedPropertyId } : newGoal;
      await portfolioApi.createGoal(goalToCreate);
      toast.success('Цель создана успешно');
      setShowAddForm(false);
      setNewGoal({ goalType: 'yearly_income', targetValue: 0 });
      await loadData();
    } catch (err: any) {
      console.error('Ошибка создания цели:', err);
      const errorMessage = err?.message || 'Не удалось создать цель';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Сессия истекла. Пожалуйста, войдите снова');
        router.push('/login');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        toast.error('Не удалось подключиться к серверу. Проверьте подключение');
      } else {
        toast.error(errorMessage);
      }
    }
  }

  function getProgress(goal: PortfolioGoal): number {
    if (goal.currentValue === null || goal.targetValue === 0) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  }

  function formatValue(value: number | null, goalType: PortfolioGoal['goalType']): string {
    if (value === null) return 'N/A';
    if (goalType === 'roi') return `${value.toFixed(1)}%`;
    if (goalType === 'properties_count') return Math.round(value).toString();
    return `$${value.toLocaleString()}`;
  }

  async function handleDeleteGoal(goalId: string) {
    try {
      await portfolioApi.deleteGoal(goalId);
      toast.success('Цель удалена');
      setDeleteConfirmGoalId(null);
      await loadData();
    } catch (err: any) {
      console.error('Ошибка удаления цели:', err);
      toast.error(err?.message || 'Не удалось удалить цель');
    }
  }

  async function handleArchiveGoal(goalId: string) {
    try {
      await portfolioApi.updateGoal(goalId, { status: 'archived' });
      toast.success('Цель архивирована');
      setArchiveConfirmGoalId(null);
      await loadData();
    } catch (err: any) {
      console.error('Ошибка архивирования цели:', err);
      toast.error(err?.message || 'Не удалось архивировать цель');
    }
  }

  async function handleRestoreGoal(goalId: string) {
    try {
      await portfolioApi.updateGoal(goalId, { status: 'active' });
      toast.success('Цель возвращена из архива');
      await loadData();
    } catch (err: any) {
      console.error('Ошибка возврата цели из архива:', err);
      toast.error(err?.message || 'Не удалось вернуть цель из архива');
    }
  }

  function startEdit(goal: PortfolioGoal) {
    setEditingGoal(goal);
    setEditForm({
      targetValue: goal.targetValue,
      targetDate: goal.targetDate || undefined,
      periodFrom: goal.periodFrom || undefined,
      periodTo: goal.periodTo || undefined,
      description: goal.description || undefined,
    });
  }

  async function handleUpdateGoal() {
    if (!editingGoal) return;
    if (!editForm.targetValue || editForm.targetValue <= 0) {
      toast.error('Введите целевое значение');
      return;
    }

    try {
      await portfolioApi.updateGoal(editingGoal.id, editForm);
      toast.success('Цель обновлена');
      setEditingGoal(null);
      await loadData();
    } catch (err: any) {
      console.error('Ошибка обновления цели:', err);
      toast.error(err?.message || 'Не удалось обновить цель');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
        <main className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-white/10 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-white/10 rounded w-64 animate-pulse"></div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 mb-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="h-5 bg-white/10 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                  <div className="h-2 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <main className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/portfolio')}
            className="text-white/60 hover:text-white transition mb-4 px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
          >
            ← Назад к портфелю
          </button>
          <h1 className="text-3xl font-bold mb-2">Цели и прогнозы</h1>
          <p className="text-white/60">Управление целями портфеля и объектов</p>
        </div>

        {/* Прогнозы */}
        {forecasts && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🔮</span>
              <span>Прогнозы портфеля</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60 mb-1">Прогноз годового дохода</div>
                <div className="text-xl font-semibold text-green-400">
                  ${forecasts.forecastYearlyIncome.toLocaleString()}
                </div>
                <div className="text-xs text-white/40 mt-1">От объектов в аренде</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60 mb-1">Прогноз дохода от стройки</div>
                <div className="text-xl font-semibold text-blue-400">
                  ${forecasts.forecastConstructionIncome.toLocaleString()}
                </div>
                <div className="text-xs text-white/40 mt-1">После завершения строительства</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60 mb-1">Общий прогноз дохода</div>
                <div className="text-xl font-semibold text-green-400">
                  ${forecasts.totalForecastIncome.toLocaleString()}
                </div>
                <div className="text-xs text-white/40 mt-1">Суммарный доход</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60 mb-1">Прогноз прироста стоимости</div>
                <div className="text-xl font-semibold text-purple-400">
                  ${forecasts.forecastValueGrowth.toLocaleString()}
                </div>
                <div className="text-xs text-white/40 mt-1">Капитальный прирост</div>
              </div>
            </div>
          </div>
        )}

        {/* Цели */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>🎯</span>
              <span>Цели {selectedPropertyId ? 'объекта' : 'портфеля'}</span>
            </h2>
            <div className="flex gap-2">
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary min-h-[44px]"
              >
                <option value="">Все портфеля</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 active:bg-white/15 min-h-[44px] flex items-center"
              >
                {showArchived ? 'Активные' : 'Архив'}
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-lg border border-sabay-primary bg-sabay-primary/10 px-4 py-3 text-sm font-medium text-sabay-primary transition hover:bg-sabay-primary/20 active:bg-sabay-primary/30 min-h-[44px] flex items-center"
              >
                {showAddForm ? 'Отмена' : '+ Добавить цель'}
              </button>
            </div>
          </div>

          {/* Форма добавления цели */}
          {showAddForm && (
            <div className="mb-6 p-4 rounded-lg border border-white/10 bg-white/5">
              <h3 className="text-sm font-medium mb-4">Новая цель</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Тип цели</label>
                  <select
                    value={newGoal.goalType}
                    onChange={(e) => setNewGoal({ ...newGoal, goalType: e.target.value as PortfolioGoal['goalType'] })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                  >
                    {Object.entries(GOAL_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Целевое значение</label>
                  <input
                    type="number"
                    value={newGoal.targetValue || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    placeholder="Введите значение"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Период начала (опционально)</label>
                  <input
                    type="date"
                    value={newGoal.periodFrom || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, periodFrom: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    title="С какой даты учитывать данные для расчета цели"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Период окончания (опционально)</label>
                  <input
                    type="date"
                    value={newGoal.periodTo || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, periodTo: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    title="По какую дату учитывать данные для расчета цели"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Дата достижения цели (опционально)</label>
                  <input
                    type="date"
                    value={newGoal.targetDate || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание (опционально)</label>
                  <input
                    type="text"
                    value={newGoal.description || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    placeholder="Краткое описание"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleCreateGoal}
                  className="rounded-lg bg-sabay-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-sabay-primary/80"
                >
                  Создать
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoal({ goalType: 'yearly_income', targetValue: 0 });
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Форма редактирования цели */}
          {editingGoal && (
            <div className="mb-6 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
              <h3 className="text-sm font-medium mb-4">Редактирование цели</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Целевое значение</label>
                  <input
                    type="number"
                    value={editForm.targetValue || ''}
                    onChange={(e) => setEditForm({ ...editForm, targetValue: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    placeholder="Введите значение"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Период начала (опционально)</label>
                  <input
                    type="date"
                    value={editForm.periodFrom || ''}
                    onChange={(e) => setEditForm({ ...editForm, periodFrom: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    title="С какой даты учитывать данные для расчета цели"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Период окончания (опционально)</label>
                  <input
                    type="date"
                    value={editForm.periodTo || ''}
                    onChange={(e) => setEditForm({ ...editForm, periodTo: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    title="По какую дату учитывать данные для расчета цели"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Дата достижения цели (опционально)</label>
                  <input
                    type="date"
                    value={editForm.targetDate || ''}
                    onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание (опционально)</label>
                  <input
                    type="text"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value || undefined })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sabay-primary"
                    placeholder="Краткое описание"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleUpdateGoal}
                  className="rounded-lg bg-sabay-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-sabay-primary/80"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingGoal(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Список целей */}
          {showArchived ? (
            archivedGoals.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                Нет архивных целей.
              </div>
            ) : (
              <div className="space-y-4">
                {archivedGoals.map((goal) => {
                  const progress = getProgress(goal);
                  return (
                    <div
                      key={goal.id}
                      className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-60"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{GOAL_TYPE_LABELS[goal.goalType]}</h3>
                            <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                              Архивировано
                            </span>
                            {goal.propertyId && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                {properties.find(p => p.id === goal.propertyId)?.name || 'Объект'}
                              </span>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-white/60 mb-2">{goal.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-white/60">
                              Текущее: <span className="text-white">{formatValue(goal.currentValue, goal.goalType)}</span>
                            </span>
                            <span className="text-white/60">
                              Цель: <span className="text-white">{formatValue(goal.targetValue, goal.goalType)}</span>
                            </span>
                            {goal.periodFrom && goal.periodTo && (
                              <span className="text-white/60">
                                Период: <span className="text-white">
                                  {new Date(goal.periodFrom).toLocaleDateString('ru-RU')} - {new Date(goal.periodTo).toLocaleDateString('ru-RU')}
                                </span>
                              </span>
                            )}
                            {goal.targetDate && (
                              <span className="text-white/60">
                                Цель до: <span className="text-white">{new Date(goal.targetDate).toLocaleDateString('ru-RU')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestoreGoal(goal.id)}
                            className="text-green-400 hover:text-green-300 text-sm"
                            title="Вернуть из архива"
                          >
                            ↻
                          </button>
                          <button
                            onClick={() => setDeleteConfirmGoalId(goal.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                          <span>Прогресс</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full transition-all bg-white/20"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              Нет активных целей. Добавьте первую цель, чтобы отслеживать прогресс.
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = getProgress(goal);
                const isCompleted = (goal.status === 'completed' as any) || progress >= 100;

                return (
                  <div
                    key={goal.id}
                    className={`rounded-lg border p-4 ${
                      isCompleted
                        ? 'border-green-500/30 bg-green-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{GOAL_TYPE_LABELS[goal.goalType]}</h3>
                            {isCompleted && (
                              <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                Достигнуто
                              </span>
                            )}
                            {goal.propertyId && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                {properties.find(p => p.id === goal.propertyId)?.name || 'Объект'}
                              </span>
                            )}
                          </div>
                          {goal.description && (
                            <p className="text-sm text-white/60 mb-2">{goal.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="text-white/60">
                            Текущее: <span className="text-white">{formatValue(goal.currentValue, goal.goalType)}</span>
                          </span>
                          <span className="text-white/60">
                            Цель: <span className="text-white">{formatValue(goal.targetValue, goal.goalType)}</span>
                          </span>
                          {goal.periodFrom && goal.periodTo && (
                            <span className="text-white/60">
                              Период: <span className="text-white">
                                {new Date(goal.periodFrom).toLocaleDateString('ru-RU')} - {new Date(goal.periodTo).toLocaleDateString('ru-RU')}
                              </span>
                            </span>
                          )}
                          {goal.targetDate && (
                            <span className="text-white/60">
                              Цель до: <span className="text-white">{new Date(goal.targetDate).toLocaleDateString('ru-RU')}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {goal.status === 'active' && (
                          <>
                            <button
                              onClick={() => startEdit(goal)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => setArchiveConfirmGoalId(goal.id)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm"
                              title="Архивировать"
                            >
                              📦
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteConfirmGoalId(goal.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                        <span>Прогресс</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isCompleted ? 'bg-green-500' : 'bg-sabay-primary'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Модальное окно подтверждения удаления */}
          {deleteConfirmGoalId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirmGoalId(null)}>
              <div className="rounded-xl border border-white/10 bg-slate-900 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4">Подтверждение удаления</h3>
                <p className="text-white/60 mb-6">Вы уверены, что хотите удалить эту цель? Это действие нельзя отменить.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteGoal(deleteConfirmGoalId)}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Удалить
                  </button>
                  <button
                    onClick={() => setDeleteConfirmGoalId(null)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Модальное окно подтверждения архивирования */}
          {archiveConfirmGoalId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setArchiveConfirmGoalId(null)}>
              <div className="rounded-xl border border-white/10 bg-slate-900 p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4">Подтверждение архивирования</h3>
                <p className="text-white/60 mb-6">Вы уверены, что хотите архивировать эту цель? Вы сможете вернуть её из архива позже.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchiveGoal(archiveConfirmGoalId)}
                    className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                  >
                    Архивировать
                  </button>
                  <button
                    onClick={() => setArchiveConfirmGoalId(null)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

