'use client';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Если status это payout status
  if (status === 'planned' || status === 'paid' || status === 'delayed') {
    const payoutConfig: Record<string, { label: string; className: string }> = {
      planned: { label: 'Запланировано', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      paid: { label: 'Оплачено', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      delayed: { label: 'Задержано', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    const config = payoutConfig[status] || { label: status, className: 'bg-white/10 text-white/60 border-white/20' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${config.className}`}>
        {config.label}
      </span>
    );
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    under_construction: { label: 'В стройке', className: 'bg-yellow-500/20 text-yellow-300' },
    rental: { label: 'В аренде', className: 'bg-green-500/20 text-green-300' },
    closed: { label: 'Закрыт', className: 'bg-gray-500/20 text-gray-300' },
    active: { label: 'Активен', className: 'bg-green-500/20 text-green-300' },
    inactive: { label: 'Неактивен', className: 'bg-red-500/20 text-red-300' },
  };

  const config = statusConfig[status] || { label: status, className: 'bg-gray-500/20 text-gray-300' };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
