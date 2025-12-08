'use client';

import React from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({ columns, data, loading, emptyMessage = 'Нет данных' }: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white/5 rounded-lg p-8 text-center text-white/60">
        Загрузка...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-8 text-center text-white/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 text-left text-sm font-medium text-white/80">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-white/5 transition">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3 text-sm text-white/90">
                    {column.render ? column.render(item) : String(item[column.key] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
