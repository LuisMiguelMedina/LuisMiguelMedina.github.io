export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user';
  adminLevel?: 1 | 2 | 3 | 4;
  permissions?: AdminPermissions;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AdminPermissions {
  canViewDashboard: boolean;
  canViewProfile: boolean;
  canViewLogs: boolean;
  canViewMonitoreo: boolean;
  canViewArticulos: boolean;
  canViewAnuncios: boolean;
  canViewDirectorio: boolean;
  canViewMisiones: boolean;
  canAccessSettings: boolean;
  categories: string[];
}

export const ADMIN_LEVEL_PERMISSIONS: Record<1 | 2 | 3 | 4, AdminPermissions> = {
  1: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewLogs: true,
    canViewMonitoreo: false,
    canViewArticulos: false,
    canViewAnuncios: true,
    canViewDirectorio: false,
    canViewMisiones: false,
    canAccessSettings: false,
    categories: ['dashboard', 'profile', 'logs', 'anuncios']
  },
  2: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewLogs: true,
    canViewMonitoreo: true,
    canViewArticulos: false,
    canViewAnuncios: true,
    canViewDirectorio: true,
    canViewMisiones: false,
    canAccessSettings: false,
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'anuncios', 'directorio']
  },
  3: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewLogs: true,
    canViewMonitoreo: true,
    canViewArticulos: true,
    canViewAnuncios: true,
    canViewDirectorio: true,
    canViewMisiones: true,
    canAccessSettings: false,
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'articulos', 'anuncios', 'directorio', 'misiones']
  },
  4: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewLogs: true,
    canViewMonitoreo: true,
    canViewArticulos: true,
    canViewAnuncios: true,
    canViewDirectorio: true,
    canViewMisiones: true,
    canAccessSettings: true,
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'articulos', 'anuncios', 'directorio', 'misiones', 'settings']
  }
};

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User | null;
  token: string;
  expiresIn: number;
  success: boolean;
  message: string;
}
