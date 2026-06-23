// Permission + menu helpers for the Multiverse of Madness portal. Ported from
// the legacy Angular PermissionsService (services/permissions.service.ts). Pure
// functions keyed on AdminLevel — no signals/state; session lives in auth.tsx.
import {
  AdminLevel,
  AdminPermissions,
  ADMIN_LEVEL_PERMISSIONS,
} from './types';
import { PORTAL_BASE } from './constants';

/** Permission flags for a given admin level (legacy permissions() computed). */
export function permissionsForLevel(level: AdminLevel): AdminPermissions {
  return ADMIN_LEVEL_PERMISSIONS[level];
}

/**
 * Menu items visible to a given level. Ported from legacy getMenuItems():
 * legacy paths '/app/<x>' become absolute PORTAL_BASE + '/<x>', icons + Spanish
 * labels preserved, returning ONLY the items visible for that level.
 */
export function menuItemsForLevel(
  level: AdminLevel,
): { to: string; icon: string; label: string }[] {
  const perms = permissionsForLevel(level);
  const all: { to: string; icon: string; label: string; visible: boolean }[] = [
    {
      to: `${PORTAL_BASE}/dashboard`,
      icon: 'fas fa-tachometer-alt',
      label: 'Panel',
      visible: perms.canViewDashboard,
    },
    {
      to: `${PORTAL_BASE}/anuncios`,
      icon: 'fas fa-bullhorn',
      label: 'Anuncios',
      visible: perms.canViewAnuncios,
    },
    {
      to: `${PORTAL_BASE}/profile`,
      icon: 'fas fa-user',
      label: 'Perfil',
      visible: perms.canViewProfile,
    },
    {
      to: `${PORTAL_BASE}/directorio`,
      icon: 'fas fa-address-book',
      label: 'Directorio',
      visible: perms.canViewDirectorio,
    },
    {
      to: `${PORTAL_BASE}/logs`,
      icon: 'fas fa-terminal',
      label: 'Registros',
      visible: perms.canViewLogs,
    },
    {
      to: `${PORTAL_BASE}/monitoreo`,
      icon: 'fas fa-satellite-dish',
      label: 'Monitoreo',
      visible: perms.canViewMonitoreo,
    },
    {
      to: `${PORTAL_BASE}/misiones`,
      icon: 'fas fa-crosshairs',
      label: 'Misiones',
      visible: perms.canViewMisiones,
    },
    {
      to: `${PORTAL_BASE}/articulos`,
      icon: 'fas fa-folder-open',
      label: 'Artículos',
      visible: perms.canViewArticulos,
    },
    {
      to: `${PORTAL_BASE}/settings`,
      icon: 'fas fa-cog',
      label: 'Configuración',
      visible: perms.canAccessSettings,
    },
  ];
  return all
    .filter((item) => item.visible)
    .map(({ to, icon, label }) => ({ to, icon, label }));
}

/** Human-readable admin level name (legacy getLevelName()). */
export function levelName(level: AdminLevel): string {
  switch (level) {
    case 1:
      return 'APM';
    case 2:
      return 'PM';
    case 3:
      return 'Senior PM';
    case 4:
      return 'GPM';
    default:
      return 'Desconocido';
  }
}

/**
 * Badge color per level (legacy getLevelColor()).
 * 1: verde claro, 2: azul, 3: morado, 4: dorado.
 */
export function levelColor(level: AdminLevel): string {
  switch (level) {
    case 1:
      return '#90EE90'; // Verde claro
    case 2:
      return '#4A90D9'; // Azul
    case 3:
      return '#9B59B6'; // Morado
    case 4:
      return '#FFD700'; // Dorado
    default:
      return '#808080'; // Gris
  }
}
