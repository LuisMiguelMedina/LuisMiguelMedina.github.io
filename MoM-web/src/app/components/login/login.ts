import { Component, OnInit, OnDestroy, inject, Injector, runInInjectionContext, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../models/user.model';
import { Database, ref, set, onValue, off } from '@angular/fire/database';
import { PermissionsService } from '../../services/permissions.service';

interface AdminCredential {
  username: string;
  password: string;
  name: string;
  active: boolean;
  level: 1 | 2 | 3;
}

interface AttemptBlock {
  visible: boolean;
  fadeOut: boolean;
}

interface SystemConfig {
  maxAttempts: number;
  locked: boolean;
  currentAttempts: number;
  lastAttempt?: string;
}

const FIREBASE_ADMINS_PATH = 'system/admins';
const FIREBASE_CONFIG_PATH = 'system/config';
const LOCAL_CACHE_KEY = 'mom_config_cache';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit, OnDestroy {
  private database = inject(Database);
  private injector = inject(Injector);
  private router = inject(Router);
  private permissionsService = inject(PermissionsService);
  private cdr = inject(ChangeDetectorRef);

  loginData: LoginRequest = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  errorMessage = '';
  showError = false;
  failedAttempts = 0;
  maxAttempts = 10;
  isLocked = false;
  visibleAttempts: AttemptBlock[] = [];
  isInitialized = false;

  private admins: AdminCredential[] = [];
  private configRef: any;
  private adminsRef: any;

  constructor() {
    // Cargar desde cache local inmediatamente para mostrar datos al instante
    this.loadFromLocalCache();
  }

  ngOnInit(): void {
    // Sincronizar con Firebase en segundo plano con timeout
    runInInjectionContext(this.injector, () => {
      this.loadFromFirebase();
    });

    // Timeout de seguridad - marcar como inicializado después de 3 segundos
    // para permitir login incluso si Firebase tarda
    setTimeout(() => {
      if (!this.isInitialized) {
        console.warn('Firebase timeout - using cached/fallback data');
        this.isInitialized = true;
        this.cdr.markForCheck();
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.configRef) off(this.configRef);
    if (this.adminsRef) off(this.adminsRef);
  }

  private loadFromLocalCache(): void {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const config = JSON.parse(cached);
        this.maxAttempts = config.maxAttempts || 10;
        this.failedAttempts = config.currentAttempts || 0;
        this.isLocked = config.locked || false;
      }
    } catch (e) {
      // Usar valores por defecto si falla
    }
    this.updateVisibleAttempts();
  }

  private loadFromFirebase(): void {
    // Cargar configuración del sistema
    this.configRef = ref(this.database, FIREBASE_CONFIG_PATH);
    onValue(this.configRef, (snapshot) => {
      const data = snapshot.val() as SystemConfig | null;
      if (data) {
        this.maxAttempts = data.maxAttempts || 10;
        this.failedAttempts = data.currentAttempts || 0;
        this.isLocked = data.locked || false;
        // Actualizar cache local
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
        this.updateVisibleAttempts();
      } else {
        this.initializeFirebaseConfig();
      }
      this.isInitialized = true;
      this.cdr.markForCheck();
    }, (error) => {
      console.error('Firebase config error:', error);
      this.isInitialized = true;
      this.cdr.markForCheck();
    });

    // Cargar admins
    this.adminsRef = ref(this.database, FIREBASE_ADMINS_PATH);
    onValue(this.adminsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Asignar nivel por defecto a admins existentes que no tienen level
        this.admins = Object.values(data)
          .filter((a: any) => a.active !== false)
          .map((a: any) => ({
            ...a,
            level: a.level || 3 // Nivel 3 por defecto para compatibilidad
          })) as AdminCredential[];
      } else {
        this.initializeDefaultAdmins();
      }
      this.cdr.markForCheck();
    }, (error) => {
      console.error('Firebase admins error:', error);
      this.admins = [
        { username: 'admin001', password: 'dimension2024', name: 'Admin Principal', active: true, level: 3 },
        { username: 'root', password: 'momadmin', name: 'Root Administrator', active: true, level: 3 }
      ];
      this.cdr.markForCheck();
    });
  }

  private async initializeFirebaseConfig(): Promise<void> {
    const config: SystemConfig = { maxAttempts: 10, locked: false, currentAttempts: 0 };
    try {
      await set(ref(this.database, FIREBASE_CONFIG_PATH), config);
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(config));
      this.updateVisibleAttempts();
    } catch (e) {
      console.error('Init config error:', e);
    }
  }

  private async initializeDefaultAdmins(): Promise<void> {
    const admins: { [k: string]: AdminCredential } = {
      admin001: { username: 'admin001', password: 'dimension2024', name: 'Super Admin', active: true, level: 3 },
      admin002: { username: 'admin002', password: 'madness2024', name: 'Manager', active: true, level: 2 },
      admin003: { username: 'admin003', password: 'quantum2024', name: 'Viewer', active: true, level: 1 },
      root: { username: 'root', password: 'momadmin', name: 'Root Administrator', active: true, level: 3 }
    };
    try {
      await set(ref(this.database, FIREBASE_ADMINS_PATH), admins);
      this.admins = Object.values(admins);
    } catch (e) {
      console.error('Init admins error:', e);
    }
  }

  private updateVisibleAttempts(): void {
    const remaining = this.maxAttempts - this.failedAttempts;
    this.visibleAttempts = Array(Math.max(0, remaining)).fill(null).map(() => ({
      visible: true,
      fadeOut: false
    }));
  }

  private async saveConfig(): Promise<void> {
    const config: SystemConfig = {
      maxAttempts: this.maxAttempts,
      locked: this.isLocked,
      currentAttempts: this.failedAttempts,
      lastAttempt: new Date().toISOString()
    };

    // Guardar en cache local PRIMERO para carga instantánea
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(config));

    // Guardar en Firebase en segundo plano (no bloquea UI)
    // Con timeout de 2 segundos para evitar esperas largas
    const savePromise = set(ref(this.database, FIREBASE_CONFIG_PATH), config);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firebase save timeout')), 2000)
    );

    try {
      await Promise.race([savePromise, timeoutPromise]);
    } catch (e: any) {
      console.warn('Save config warning:', e.message || e);
      // No bloquear el flujo si Firebase falla
    }
  }

  private async removeOneAttempt(): Promise<void> {
    if (this.visibleAttempts.length > 0) {
      this.visibleAttempts[this.visibleAttempts.length - 1].fadeOut = true;
      await this.delay(500);
      this.visibleAttempts.pop();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isLoading || this.isLocked) return;

    // Permitir login incluso si Firebase no ha respondido
    // usando datos en cache local
    if (!this.isInitialized && this.admins.length === 0) {
      // Usar admins de fallback si no hay datos
      this.admins = [
        { username: 'admin001', password: 'dimension2024', name: 'Super Admin', active: true, level: 3 },
        { username: 'admin002', password: 'madness2024', name: 'Manager', active: true, level: 2 },
        { username: 'root', password: 'momadmin', name: 'Root Administrator', active: true, level: 3 }
      ];
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showError = false;

    // Delay reducido para mejor UX
    await this.delay(300 + Math.random() * 200);

    try {
      const username = this.loginData.email.toLowerCase().trim();
      const password = this.loginData.password;

      const validUser = this.admins.find(
        admin => admin.username.toLowerCase() === username && admin.password === password
      );

      if (validUser) {
        this.errorMessage = '';
        this.showError = false;

        // Guardar sesión con nivel de admin usando PermissionsService
        this.permissionsService.setAdminSession({
          username: validUser.username,
          name: validUser.name,
          role: 'admin',
          level: validUser.level || 1,
          loginTime: new Date().toISOString()
        });

        this.failedAttempts = 0;
        this.isLocked = false;
        await this.saveConfig();
        this.updateVisibleAttempts();

        this.router.navigate(['/app/dashboard']);
      } else {
        this.failedAttempts++;
        this.showError = true;

        if (this.failedAttempts >= this.maxAttempts) {
          this.isLocked = true;
        }

        await this.saveConfig();
        await this.removeOneAttempt();

        const msgs = [
          'ACCESS DENIED - Invalid credentials',
          'AUTHENTICATION FAILURE - Verify admin ID',
          'IDENTITY NOT RECOGNIZED - Access rejected',
          'SECURITY ALERT - Unauthorized attempt logged'
        ];

        this.errorMessage = this.isLocked
          ? 'SYSTEM LOCKDOWN - Maximum attempts exceeded'
          : msgs[Math.floor(Math.random() * msgs.length)];

        setTimeout(() => { this.showError = false; }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'CONNECTION ERROR - System unavailable';
      this.showError = true;
      setTimeout(() => { this.showError = false; }, 3000);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
