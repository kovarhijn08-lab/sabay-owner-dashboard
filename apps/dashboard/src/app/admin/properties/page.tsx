'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, adminApi, type OwnerProperty, type User, type AssignManagerDto, type Project, type Unit } from '../../../lib/api-client';
import { DataTable, type Column } from '../../../components/common/DataTable';
import { FilterBar, FilterSelect, FilterInput } from '../../../components/common/FilterBar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormModal } from '../../../components/common/FormModal';
import { Breadcrumbs } from '../../../components/common/Breadcrumbs';
import { useToastContext } from '../../../components/ToastProvider';

type TabType = 'properties' | 'projects' | 'units';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const toast = useToastContext();
  const [activeTab, setActiveTab] = useState<TabType>('properties');
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<OwnerProperty | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [filters, setFilters] = useState({ status: '', managerId: '', ownerId: '', search: '' });
  const [assignData, setAssignData] = useState<AssignManagerDto>({
    managerId: null,
    ownerId: null,
    managementCompanyId: null,
  });

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, filters, activeTab]);

  async function loadData() {
    try {
      setLoading(true);
      const [propertiesData, projectsData, unitsData, usersData] = await Promise.all([
        adminApi.getProperties({
          managerId: filters.managerId || undefined,
          ownerId: filters.ownerId || undefined,
          status: filters.status || undefined,
        }),
        adminApi.getProjects(),
        adminApi.getUnits(),
        adminApi.getUsers(),
      ]);

      let filteredProperties = propertiesData;
      let filteredProjects = projectsData;
      let filteredUnits = unitsData;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProperties = propertiesData.filter(
          (p) =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.region?.toLowerCase().includes(searchLower)
        );
        filteredProjects = projectsData.filter(
          (p) =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.region?.toLowerCase().includes(searchLower)
        );
        filteredUnits = unitsData.filter(
          (u) =>
            u.unitNumber?.toLowerCase().includes(searchLower) ||
            (u.building && u.building.toLowerCase().includes(searchLower))
        );
      }

      setProperties(filteredProperties);
      setProjects(filteredProjects);
      setUnits(filteredUnits);
      setUsers(usersData);
    } catch (err: any) {
      toast.error(err.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign() {
    try {
      if (activeTab === 'properties' && selectedProperty) {
        await adminApi.assignManager(selectedProperty.id, assignData);
        toast.success('Назначения успешно обновлены');
      } else if (activeTab === 'projects' && selectedProject) {
        await adminApi.updateProjectDefaultManager(selectedProject.id, assignData.managerId);
        toast.success('Менеджер проекта успешно обновлен');
      } else if (activeTab === 'units' && selectedUnit) {
        await adminApi.assignManagerToUnit(selectedUnit.id, assignData.managerId);
        toast.success('Менеджер юнита успешно обновлен');
      }
      setShowAssignModal(false);
      resetAssignForm();
      setSelectedProperty(null);
      setSelectedProject(null);
      setSelectedUnit(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Ошибка обновления назначений');
    }
  }

  function resetAssignForm() {
    setAssignData({
      managerId: null,
      ownerId: null,
      managementCompanyId: null,
    });
  }

  function handleAssignClick(property: OwnerProperty) {
    setSelectedProperty(property);
    setSelectedProject(null);
    setSelectedUnit(null);
    setAssignData({
      managerId: property.managerId || null,
      ownerId: property.ownerId || null,
      managementCompanyId: property.managementCompanyId || null,
    });
    setShowAssignModal(true);
  }

  function handleAssignProjectClick(project: Project) {
    setSelectedProject(project);
    setSelectedProperty(null);
    setSelectedUnit(null);
    setAssignData({
      managerId: project.defaultManagerId || null,
      ownerId: null,
      managementCompanyId: null,
    });
    setShowAssignModal(true);
  }

  function handleAssignUnitClick(unit: Unit) {
    setSelectedUnit(unit);
    setSelectedProperty(null);
    setSelectedProject(null);
    setAssignData({
      managerId: unit.managerId || null,
      ownerId: null,
      managementCompanyId: null,
    });
    setShowAssignModal(true);
  }

  const managers = users.filter((u) => u.role === 'manager');
  const owners = users.filter((u) => u.role === 'owner');

  const columns: Column<OwnerProperty>[] = [
    {
      key: 'name',
      label: 'Название',
      render: (property) => (
        <Link
          href={`/portfolio/properties/${property.id}`}
          className="font-medium text-sabay-primary hover:underline"
        >
          {property.name || '-'}
        </Link>
      ),
    },
    { key: 'region', label: 'Регион', render: (p) => p.region || '-' },
    {
      key: 'status',
      label: 'Статус',
      render: (property) => <StatusBadge status={property.status} />,
    },
    {
      key: 'manager',
      label: 'Менеджер',
      render: (property) => {
        const manager = users.find((u) => u.id === property.managerId);
        return manager ? manager.name || manager.login : '-';
      },
    },
    {
      key: 'owner',
      label: 'Владелец',
      render: (property) => {
        const owner = users.find((u) => u.id === property.ownerId);
        return owner ? owner.name || owner.login : '-';
      },
    },
    {
      key: 'purchasePrice',
      label: 'Цена покупки',
      render: (property) => property.purchasePrice ? `${property.purchasePrice.toLocaleString('ru-RU')} ₽` : '-',
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (property) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAssignClick(property)}
            className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition min-h-[44px]"
          >
            Назначить
          </button>
        </div>
      ),
    },
  ];

  const projectColumns: Column<Project>[] = [
    {
      key: 'name',
      label: 'Название',
      render: (project) => <span className="font-medium">{project.name || '-'}</span>,
    },
    { key: 'region', label: 'Регион', render: (p) => p.region || '-' },
    { key: 'developer', label: 'Застройщик', render: (p) => p.developer || '-' },
    {
      key: 'defaultManagerId',
      label: 'Менеджер по умолчанию',
      render: (project) => {
        const manager = users.find((u) => u.id === project.defaultManagerId);
        return manager ? manager.name || manager.login : '-';
      },
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (project) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAssignProjectClick(project)}
            className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition min-h-[44px]"
          >
            Назначить менеджера
          </button>
        </div>
      ),
    },
  ];

  const unitColumns: Column<Unit>[] = [
    {
      key: 'unitNumber',
      label: 'Номер юнита',
      render: (unit) => <span className="font-medium">{unit.unitNumber || '-'}</span>,
    },
    { key: 'building', label: 'Корпус', render: (u) => u.building || '-' },
    { key: 'floor', label: 'Этаж', render: (u) => u.floor || '-' },
    {
      key: 'area',
      label: 'Площадь',
      render: (unit) => (unit.area ? `${unit.area} м²` : '-'),
    },
    {
      key: 'projectId',
      label: 'Проект',
      render: (unit) => {
        const project = projects.find((p) => p.id === unit.projectId);
        return project ? project.name : '-';
      },
    },
    {
      key: 'managerId',
      label: 'Менеджер',
      render: (unit) => {
        const manager = users.find((u) => u.id === unit.managerId);
        return manager ? manager.name || manager.login : '-';
      },
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (unit) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAssignUnitClick(unit)}
            className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition min-h-[44px]"
          >
            Назначить менеджера
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Объекты' },
          ]}
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">Управление объектами</h1>
          <p className="text-white/60">Назначение менеджеров и владельцев, управление статусами объектов</p>
        </div>

        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'properties'
                ? 'text-sabay-primary border-b-2 border-sabay-primary'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Купленные объекты ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'projects'
                ? 'text-sabay-primary border-b-2 border-sabay-primary'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Проекты ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'units'
                ? 'text-sabay-primary border-b-2 border-sabay-primary'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Юниты ({units.length})
          </button>
        </div>

        <FilterBar>
          <FilterSelect
            label="Статус"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { value: '', label: 'Все' },
              { value: 'under_construction', label: 'В стройке' },
              { value: 'rental', label: 'В аренде' },
              { value: 'closed', label: 'Закрыт' },
            ]}
          />
          <FilterSelect
            label="Менеджер"
            value={filters.managerId}
            onChange={(value) => setFilters({ ...filters, managerId: value })}
            options={[
              { value: '', label: 'Все' },
              ...managers.map((m) => ({ value: m.id, label: m.name || m.login })),
            ]}
          />
          <FilterSelect
            label="Владелец"
            value={filters.ownerId}
            onChange={(value) => setFilters({ ...filters, ownerId: value })}
            options={[
              { value: '', label: 'Все' },
              ...owners.map((o) => ({ value: o.id, label: o.name || o.login })),
            ]}
          />
          <FilterInput
            label="Поиск"
            value={filters.search}
            onChange={(value) => setFilters({ ...filters, search: value })}
            placeholder="Название, регион..."
            type="search"
          />
        </FilterBar>

        {activeTab === 'properties' && (
          <DataTable
            columns={columns}
            data={properties}
            loading={loading}
            emptyMessage="Купленные объекты не найдены"
          />
        )}

        {activeTab === 'projects' && (
          <DataTable
            columns={projectColumns}
            data={projects}
            loading={loading}
            emptyMessage="Проекты не найдены"
          />
        )}

        {activeTab === 'units' && (
          <DataTable
            columns={unitColumns}
            data={units}
            loading={loading}
            emptyMessage="Юниты не найдены"
          />
        )}

        <FormModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            resetAssignForm();
            setSelectedProperty(null);
            setSelectedProject(null);
            setSelectedUnit(null);
          }}
          title={
            activeTab === 'properties'
              ? `Назначить менеджера и владельца: ${selectedProperty?.name}`
              : activeTab === 'projects'
              ? `Назначить менеджера проекта: ${selectedProject?.name}`
              : `Назначить менеджера юнита: ${selectedUnit?.unitNumber}`
          }
          size="md"
          footer={
            <>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  resetAssignForm();
                  setSelectedProperty(null);
                  setSelectedProject(null);
                  setSelectedUnit(null);
                }}
                className="px-4 py-2 text-white/80 hover:text-white transition rounded-lg hover:bg-white/5 min-h-[44px]"
              >
                Отмена
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 bg-sabay-primary rounded-lg hover:bg-sabay-primary/90 transition min-h-[44px]"
              >
                Сохранить
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Менеджер</label>
              <select
                value={assignData.managerId || ''}
                onChange={(e) =>
                  setAssignData({ ...assignData, managerId: e.target.value || null })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Не назначен</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.login}
                  </option>
                ))}
              </select>
            </div>
            {activeTab === 'properties' && (
              <div>
                <label className="block text-sm font-medium mb-2">Владелец</label>
                <select
                  value={assignData.ownerId || ''}
                  onChange={(e) =>
                    setAssignData({ ...assignData, ownerId: e.target.value || null })
                  }
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Не назначен</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name || o.login}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </FormModal>
      </div>
    </div>
  );
}
