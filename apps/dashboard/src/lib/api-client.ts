const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface LoginRequest {
  login: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    login: string;
    role: string;
    name?: string;
    email?: string;
  };
}

interface User {
  id: string;
  login: string;
  role: 'admin' | 'manager' | 'owner' | 'management_company';
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
}

interface OwnerProperty {
  id: string;
  name: string;
  region: string;
  status: 'under_construction' | 'rental' | 'closed';
  managerId?: string | null;
  ownerId?: string | null;
  managementCompanyId?: string | null;
  unitId?: string | null;
  projectId?: string | null;
  purchasePrice: number;
  purchaseDate?: string | null;
  currentEstimate?: number | null;
  constructionProgress?: number | null;
  constructionStage?: string | null;
  plannedCompletionDate?: string | null;
  actualCompletionDate?: string | null;
  expectedAdr?: number | null;
  expectedOccupancy?: number | null;
  riskLevel?: 'low' | 'medium' | 'high';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Project {
  id: string;
  name: string;
  region: string;
  developer?: string | null;
  defaultManagerId?: string | null;
}

interface Unit {
  id: string;
  unitNumber: string;
  building?: string | null;
  floor?: number | null;
  area?: number | null;
  projectId?: string | null;
  managerId?: string | null;
}

interface AssignManagerDto {
  managerId?: string | null;
  ownerId?: string | null;
  managementCompanyId?: string | null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Если 401 - неавторизован, возможно токен истек
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }
    
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Прямой запрос без токена для логина
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as LoginResponse;
      
      if (data && data.accessToken && data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }
    } catch (error: any) {
      console.error('Ошибка входа:', error);
      if (error.message) {
        throw error;
      }
      throw new Error('Ошибка подключения к серверу');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  },
};

export const adminApi = {
  async getUsers() {
    return request<User[]>('/admin/users');
  },

  async getProperties(params?: { managerId?: string; ownerId?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.managerId) query.append('managerId', params.managerId);
    if (params?.ownerId) query.append('ownerId', params.ownerId);
    if (params?.status) query.append('status', params.status);
    return request<OwnerProperty[]>(`/admin/properties?${query.toString()}`);
  },

  async getProjects() {
    return request<Project[]>('/admin/projects');
  },

  async getUnits(params?: { projectId?: string; managerId?: string }) {
    const query = new URLSearchParams();
    if (params?.projectId) query.append('projectId', params.projectId);
    if (params?.managerId) query.append('managerId', params.managerId);
    return request<Unit[]>(`/admin/units?${query.toString()}`);
  },

  async assignManager(propertyId: string, data: AssignManagerDto) {
    return request(`/admin/properties/${propertyId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async updateProjectDefaultManager(projectId: string, managerId: string | null) {
    return request(`/admin/projects/${projectId}/default-manager`, {
      method: 'PATCH',
      body: JSON.stringify({ managerId }),
    });
  },

  async assignManagerToUnit(unitId: string, managerId: string | null) {
    return request(`/admin/units/${unitId}/assign-manager`, {
      method: 'PATCH',
      body: JSON.stringify({ managerId }),
    });
  },

  async getDictionaries(type?: string) {
    const query = type ? `?type=${type}` : '';
    return request(`/admin/dictionaries${query}`);
  },

  async getSLASettings() {
    return request('/admin/sla');
  },

  async getLogs(params?: { userId?: string; propertyId?: string; changeType?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.userId) query.append('userId', params.userId);
    if (params?.propertyId) query.append('propertyId', params.propertyId);
    if (params?.changeType) query.append('changeType', params.changeType);
    if (params?.limit) query.append('limit', params.limit.toString());
    return request(`/admin/logs?${query.toString()}`);
  },
};

export const managerApi = {
  async getMyProperties() {
    return request<OwnerProperty[]>('/manager/properties');
  },

  async getPropertyById(id: string) {
    return request<OwnerProperty>(`/manager/properties/${id}`);
  },
};

export const catalogApi = {
  /**
   * Получить все проекты каталога
   * @param region - фильтр по региону (опционально)
   */
  async getProjects(region?: string) {
    const query = region ? `?region=${encodeURIComponent(region)}` : '';
    return request<Project[]>(`/catalog/projects${query}`);
  },

  /**
   * Получить проект по ID
   */
  async getProjectById(id: string) {
    return request<Project>(`/catalog/projects/${id}`);
  },

  /**
   * Получить юниты проекта
   */
  async getUnitsByProject(projectId: string) {
    return request<Unit[]>(`/catalog/projects/${projectId}/units`);
  },

  /**
   * Получить юнит по ID
   */
  async getUnitById(id: string) {
    return request<Unit>(`/catalog/units/${id}`);
  },

  /**
   * Получить список регионов
   */
  async getRegions() {
    return request<string[]>('/catalog/regions');
  },
};

export interface PortfolioGoal {
  id: string;
  ownerId: string;
  propertyId?: string | null;
  goalType: 'roi' | 'yearly_income' | 'properties_count' | 'portfolio_value' | 'value_growth';
  targetValue: number;
  currentValue: number | null;
  targetDate?: string | null;
  periodFrom?: string | null;
  periodTo?: string | null;
  description?: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalDto {
  goalType: 'roi' | 'yearly_income' | 'properties_count' | 'portfolio_value' | 'value_growth';
  targetValue: number;
  propertyId?: string | null;
  targetDate?: string | null;
  periodFrom?: string | null;
  periodTo?: string | null;
  description?: string | null;
}

export interface UpdateGoalDto {
  targetValue?: number;
  targetDate?: string | null;
  periodFrom?: string | null;
  periodTo?: string | null;
  description?: string | null;
  status?: 'active' | 'archived';
}

export interface PortfolioForecasts {
  forecastYearlyIncome: number;
  forecastConstructionIncome: number;
  totalForecastIncome: number;
  forecastValueGrowth: number;
}

export interface UpdatePropertyDto {
  name?: string;
  region?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  status?: 'under_construction' | 'rental' | 'closed';
  currentEstimate?: number;
  constructionProgress?: number;
  constructionStage?: string;
  plannedCompletionDate?: string;
  expectedAdr?: number;
  expectedOccupancy?: number;
}

export interface PortfolioSummary {
  totalProperties: number;
  totalPurchaseValue: number;
  totalCurrentValue: number;
  valueGrowth: number;
  valueGrowthPercent: number;
  rentalCount: number;
  constructionCount: number;
  averageROI: number;
}

export const portfolioApi = {
  async getSummary() {
    return request<PortfolioSummary>('/portfolio/summary');
  },

  async getChartData() {
    return request<{
      valueHistory: Array<{ date: string; purchaseValue: number; currentValue: number }>;
      statusDistribution: { rental: number; under_construction: number; closed: number };
      topRegions: Array<{ region: string; count: number }>;
    }>('/portfolio/chart-data');
  },

  async getProperties() {
    return request<OwnerProperty[]>('/portfolio/properties');
  },

  async getPropertyById(id: string) {
    return request<OwnerProperty>(`/portfolio/properties/${id}`);
  },

  async getProperty(id: string) {
    return request<OwnerProperty>(`/portfolio/properties/${id}`);
  },

  async getPropertyHistory(id: string, limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return request<any[]>(`/portfolio/properties/${id}/history${query}`);
  },

  async getPropertyAnalytics(id: string) {
    return request<{
      roi: number;
      paybackPeriodYears: number | null;
      irr: number | null;
      cagr: number | null;
      forecastAnnualIncome: number | null;
      yieldPercent: number | null;
    }>(`/portfolio/properties/${id}/analytics`);
  },

  async createProperty(data: CreatePropertyDto) {
    return request<OwnerProperty>('/portfolio/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProperty(id: string, data: UpdatePropertyDto) {
    return request<OwnerProperty>(`/portfolio/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getActiveGoals(propertyId?: string) {
    const query = propertyId ? `?propertyId=${propertyId}` : '';
    return request<PortfolioGoal[]>(`/portfolio/goals${query}`);
  },

  async getArchivedGoals(propertyId?: string) {
    const query = propertyId ? `?propertyId=${propertyId}` : '';
    return request<PortfolioGoal[]>(`/portfolio/goals/archived${query}`);
  },

  async createGoal(data: CreateGoalDto) {
    return request<PortfolioGoal>('/portfolio/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateGoal(id: string, data: UpdateGoalDto) {
    return request<PortfolioGoal>(`/portfolio/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteGoal(id: string) {
    return request(`/portfolio/goals/${id}`, {
      method: 'DELETE',
    });
  },

  async getForecasts() {
    return request<PortfolioForecasts>('/portfolio/forecasts');
  },

  async getNotifications() {
    return request('/portfolio/notifications');
  },

  async markNotificationAsRead(id: string) {
    return request(`/portfolio/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsAsRead() {
    return request('/portfolio/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

export type {
  User,
  LoginRequest,
  LoginResponse,
  OwnerProperty,
  Project,
  Unit,
  AssignManagerDto,
};

interface CreatePropertyDto {
  name: string;
  region: string;
  unitNumber: string;
  purchasePrice: number;
  purchaseDate?: string;
  unitId?: string | null;
  projectId?: string | null;
  managerId?: string | null;
  managementCompanyId?: string | null;
}
