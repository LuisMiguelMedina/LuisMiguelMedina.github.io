export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user';
  adminLevel?: 1 | 2 | 3;
  permissions?: AdminPermissions;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AdminPermissions {
  canViewDashboard: boolean;
  canViewProfile: boolean;
  canViewTable: boolean;
  canManageUsers: boolean;
  canAccessSettings: boolean;
  categories: string[];
}

export const ADMIN_LEVEL_PERMISSIONS: Record<1 | 2 | 3, AdminPermissions> = {
  1: {
    canViewDashboard: true,
    canViewProfile: false,
    canViewTable: false,
    canManageUsers: false,
    canAccessSettings: false,
    categories: ['dashboard']
  },
  2: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewTable: true,
    canManageUsers: false,
    canAccessSettings: false,
    categories: ['dashboard', 'profile', 'table']
  },
  3: {
    canViewDashboard: true,
    canViewProfile: true,
    canViewTable: true,
    canManageUsers: true,
    canAccessSettings: true,
    categories: ['dashboard', 'profile', 'table', 'users', 'settings']
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
