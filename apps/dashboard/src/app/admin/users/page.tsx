'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, adminApi, type User } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { FilterBar, FilterSelect } from '../../../components/common/FilterBar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

export default function AdminUsersPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: '', isActive: '' });

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, filters]);

  async function loadData() {
    try {
      setLoading(true);
      const usersData = await adminApi.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  const columns: Column<User>[] = [
    { key: 'login', label: 'Логин' },
    { key: 'name', label: 'Имя', render: (u) => u.name || '-' },
    { key: 'email', label: 'Email', render: (u) => u.email || '-' },
    {
      key: 'role',
      label: 'Роль',
      render: (user) => {
        const roleLabels: Record<string, string> = {
          admin: 'Администратор',
          manager: 'Менеджер',
          owner: 'Владелец',
          management_company: 'УК',
        };
        return roleLabels[user.role] || user.role;
      },
    },
    {
      key: 'isActive',
      label: 'Статус',
      render: (user) => <StatusBadge status={user.isActive ? 'active' : 'inactive'} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Пользователи' },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
          <p className="text-white/60">Список всех пользователей системы</p>
        </div>

        <FilterBar>
          <FilterSelect
            label="Роль"
            value={filters.role}
            onChange={(value) => setFilters({ ...filters, role: value })}
            options={[
              { value: '', label: 'Все' },
              { value: 'admin', label: 'Администратор' },
              { value: 'manager', label: 'Менеджер' },
              { value: 'owner', label: 'Владелец' },
            ]}
          />
        </FilterBar>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Пользователи не найдены"
        />
      </div>
    </div>
  );
}
