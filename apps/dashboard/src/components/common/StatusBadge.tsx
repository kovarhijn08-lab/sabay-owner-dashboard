'use client';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
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
