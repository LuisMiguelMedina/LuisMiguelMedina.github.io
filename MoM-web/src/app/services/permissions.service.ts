import { Injectable, signal, computed } from '@angular/core';
import { AdminPermissions, ADMIN_LEVEL_PERMISSIONS } from '../models/user.model';

export interface AdminSession {
    uuid: string;
    username: string;
    name: string;
    role: string;
    level: 1 | 2 | 3 | 4;
    loginTime: string;
}

// UUIDs conocidos del sistema
export const KNOWN_UUIDS = {
    KATHERINE_M2: 'KTH-M2-0021'  // Katherine M.2 (Mark 2) - Subdirectora Asistente Golden 21
} as const;

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    // Señales reactivas
    private adminLevelSignal = signal<1 | 2 | 3 | 4>(1);
    private adminSessionSignal = signal<AdminSession | null>(null);

    // Lecturas públicas
    adminLevel = this.adminLevelSignal.asReadonly();
    adminSession = this.adminSessionSignal.asReadonly();

    // Permisos computados basados en el nivel
    permissions = computed<AdminPermissions>(() => {
        const level = this.adminLevelSignal();
        return ADMIN_LEVEL_PERMISSIONS[level];
    });

    // Helpers para verificar permisos específicos
    canViewDashboard = computed(() => this.permissions().canViewDashboard);
    canViewProfile = computed(() => this.permissions().canViewProfile);
    canViewLogs = computed(() => this.permissions().canViewLogs);
    canViewMonitoreo = computed(() => this.permissions().canViewMonitoreo);
    canViewArticulos = computed(() => this.permissions().canViewArticulos);
    canViewAnuncios = computed(() => this.permissions().canViewAnuncios);
    canViewDirectorio = computed(() => this.permissions().canViewDirectorio);
    canViewMisiones = computed(() => this.permissions().canViewMisiones);
    canAccessSettings = computed(() => this.permissions().canAccessSettings);

    constructor() {
        this.loadSessionFromStorage();
    }

    /**
     * Carga la sesión del admin desde sessionStorage
     */
    private loadSessionFromStorage(): void {
        try {
            const sessionData = sessionStorage.getItem('mom_user');
            if (sessionData) {
                const session = JSON.parse(sessionData) as AdminSession;
                this.adminSessionSignal.set(session);
                this.adminLevelSignal.set(session.level || 1);
            }
        } catch (e) {
            console.error('Error loading admin session:', e);
        }
    }

    /**
     * Establece el nivel de admin después del login
     */
    setAdminLevel(level: 1 | 2 | 3): void {
        this.adminLevelSignal.set(level);
    }

    /**
     * Establece la sesión completa del admin
     */
    setAdminSession(session: AdminSession): void {
        this.adminSessionSignal.set(session);
        this.adminLevelSignal.set(session.level);
        sessionStorage.setItem('mom_user', JSON.stringify(session));
    }

    /**
     * Verifica si el admin tiene acceso a una categoría específica
     */
    hasAccessToCategory(category: string): boolean {
        return this.permissions().categories.includes(category);
    }

    /**
     * Verifica si el nivel actual es igual o mayor al requerido
     */
    hasMinimumLevel(requiredLevel: 1 | 2 | 3 | 4): boolean {
        return this.adminLevelSignal() >= requiredLevel;
    }

    /**
     * Obtiene el nombre del nivel de admin
     */
    getLevelName(): string {
        const level = this.adminLevelSignal();
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
     * Obtiene el color del badge según el nivel
     * Nivel 1: Verde claro, Nivel 2: Azul, Nivel 3: Morado, Nivel 4: Dorado
     */
    getLevelColor(): string {
        const level = this.adminLevelSignal();
        switch (level) {
            case 1:
                return '#90EE90';  // Verde claro
            case 2:
                return '#4A90D9';  // Azul
            case 3:
                return '#9B59B6';  // Morado
            case 4:
                return '#FFD700';  // Dorado
            default:
                return '#808080';  // Gris
        }
    }

    /**
     * Limpia la sesión al cerrar sesión
     */
    clearSession(): void {
        this.adminSessionSignal.set(null);
        this.adminLevelSignal.set(1);
        sessionStorage.removeItem('mom_user');
    }

    /**
     * Obtiene los items del menú permitidos según el nivel
     */
    getMenuItems(): { path: string; icon: string; label: string; visible: boolean }[] {
        const perms = this.permissions();
        return [
            {
                path: '/app/dashboard',
                icon: 'fas fa-tachometer-alt',
                label: 'Panel',
                visible: perms.canViewDashboard
            },
            {
                path: '/app/anuncios',
                icon: 'fas fa-bullhorn',
                label: 'Anuncios',
                visible: perms.canViewAnuncios
            },
            {
                path: '/app/profile',
                icon: 'fas fa-user',
                label: 'Perfil',
                visible: perms.canViewProfile
            },
            {
                path: '/app/directorio',
                icon: 'fas fa-address-book',
                label: 'Directorio',
                visible: perms.canViewDirectorio
            },
            {
                path: '/app/logs',
                icon: 'fas fa-terminal',
                label: 'Registros',
                visible: perms.canViewLogs
            },
            {
                path: '/app/monitoreo',
                icon: 'fas fa-satellite-dish',
                label: 'Monitoreo',
                visible: perms.canViewMonitoreo
            },
            {
                path: '/app/misiones',
                icon: 'fas fa-crosshairs',
                label: 'Misiones',
                visible: perms.canViewMisiones
            },
            {
                path: '/app/articulos',
                icon: 'fas fa-folder-open',
                label: 'Artículos',
                visible: perms.canViewArticulos
            },
            {
                path: '/app/settings',
                icon: 'fas fa-cog',
                label: 'Configuración',
                visible: perms.canAccessSettings
            }
        ];
    }
}
