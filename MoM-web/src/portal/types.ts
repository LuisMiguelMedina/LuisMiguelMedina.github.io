// Shared types for the Multiverse of Madness portal. Ported from the legacy
// Angular user.model.ts + permissions.service.ts. Stable contract — portal
// modules import from here; do not duplicate these definitions elsewhere.

export type AdminLevel = 1 | 2 | 3 | 4;

export interface AdminCredential {
  uuid: string;
  username: string;
  password: string;
  name: string;
  active: boolean;
  level: AdminLevel;
}

export interface AdminSession {
  uuid: string;
  username: string;
  name: string;
  role: string;
  level: AdminLevel;
  loginTime: string;
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

export const ADMIN_LEVEL_PERMISSIONS: Record<AdminLevel, AdminPermissions> = {
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
    categories: ['dashboard', 'profile', 'logs', 'anuncios'],
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
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'anuncios', 'directorio'],
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
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'articulos', 'anuncios', 'directorio', 'misiones'],
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
    categories: ['dashboard', 'profile', 'logs', 'monitoreo', 'articulos', 'anuncios', 'directorio', 'misiones', 'settings'],
  },
};
