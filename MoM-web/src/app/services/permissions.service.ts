import { Injectable, signal, computed } from '@angular/core';
import { AdminPermissions, ADMIN_LEVEL_PERMISSIONS } from '../models/user.model';

export interface AdminSession {
    username: string;
    name: string;
    role: string;
    level: 1 | 2 | 3;
    loginTime: string;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionsService {
    // Señales reactivas
    private adminLevelSignal = signal<1 | 2 | 3>(1);
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
    canViewTable = computed(() => this.permissions().canViewTable);
    canManageUsers = computed(() => this.permissions().canManageUsers);
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
    hasMinimumLevel(requiredLevel: 1 | 2 | 3): boolean {
        return this.adminLevelSignal() >= requiredLevel;
    }

    /**
     * Obtiene el nombre del nivel de admin
     */
    getLevelName(): string {
        const level = this.adminLevelSignal();
        switch (level) {
            case 1:
                return 'Viewer';
            case 2:
                return 'Manager';
            case 3:
                return 'Super Admin';
            default:
                return 'Unknown';
        }
    }

    /**
     * Obtiene el color del badge según el nivel
     */
    getLevelColor(): string {
        const level = this.adminLevelSignal();
        switch (level) {
            case 1:
                return 'cyan';
            case 2:
                return 'amber';
            case 3:
                return 'purple';
            default:
                return 'gray';
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
                label: 'Dashboard',
                visible: perms.canViewDashboard
            },
            {
                path: '/app/profile',
                icon: 'fas fa-user',
                label: 'Profile',
                visible: perms.canViewProfile
            },
            {
                path: '/app/table',
                icon: 'fas fa-terminal',
                label: 'Logs',
                visible: perms.canViewTable
            },
            {
                path: '/app/users',
                icon: 'fas fa-users',
                label: 'Users',
                visible: perms.canManageUsers
            },
            {
                path: '/app/settings',
                icon: 'fas fa-cog',
                label: 'Settings',
                visible: perms.canAccessSettings
            }
        ];
    }
}
