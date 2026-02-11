import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsService, KNOWN_UUIDS } from '../../services/permissions.service';

interface AdminStats {
  sessionsTotal: number;
  lastAccess: string;
  clearanceCode: string;
  assignedDimension: string;
  missionStatus: string;
}

interface AdminLog {
  timestamp: string;
  action: string;
  status: 'success' | 'warning' | 'info';
}

interface AdminBio {
  codename: string;
  origin: string;
  backstory: string;
  specialty: string;
  quote: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  permissionsService = inject(PermissionsService);

  adminSession = this.permissionsService.adminSession;
  adminLevel = this.permissionsService.adminLevel;

  // Computed profile info
  adminName = computed(() => this.adminSession()?.name || 'Agente Desconocido');
  adminUsername = computed(() => this.adminSession()?.username || 'N/A');
  adminRole = computed(() => {
    const level = this.adminLevel();
    switch (level) {
      case 4: return 'GPM';
      case 3: return 'SENIOR PM';
      case 2: return 'PM';
      case 1: return 'APM';
      default: return 'INDEFINIDO';
    }
  });

  // Tab navigation
  activeTab: 'overview' | 'info' | 'hr' = 'overview';

  // Check if user is Katherine M.2 by UUID
  isKTH01 = computed(() => {
    const uuid = this.adminSession()?.uuid;
    return uuid === KNOWN_UUIDS.KATHERINE_M2;
  });

  // Narrative stats
  stats: AdminStats = {
    sessionsTotal: 0,
    lastAccess: '',
    clearanceCode: '',
    assignedDimension: '',
    missionStatus: ''
  };

  // Admin bio/history
  adminBio: AdminBio = {
    codename: '',
    origin: '',
    backstory: '',
    specialty: '',
    quote: ''
  };

  // Activity log
  activityLog: AdminLog[] = [];

  ngOnInit(): void {
    this.generateNarrativeData();
  }

  switchTab(tab: 'overview' | 'info' | 'hr'): void {
    this.activeTab = tab;
  }

  private generateNarrativeData(): void {
    const level = this.adminLevel();
    const username = this.adminSession()?.username || 'admin';
    const name = this.adminSession()?.name || 'Unknown';
    const loginTime = this.adminSession()?.loginTime || new Date().toISOString();

    // Generate pseudo-random but consistent data based on username
    const hash = this.hashCode(username);

    this.stats = {
      sessionsTotal: 100 + (hash % 500),
      lastAccess: new Date(loginTime).toLocaleString('es-ES'),
      clearanceCode: `CLR-${level}${hash.toString(16).toUpperCase().slice(0, 4)}`,
      assignedDimension: level >= 2 ? 'DIMENSION-1 & DIMENSION-2' : 'DIMENSION-1',
      missionStatus: 'MONITOREO ACTIVO'
    };

    // Generate bio based on level
    this.adminBio = this.generateBio(level, name, username);

    // Generate activity log
    this.activityLog = [
      { timestamp: this.getTimeAgo(0), action: 'Sesión iniciada', status: 'success' },
      { timestamp: this.getTimeAgo(5), action: 'Protocolos de seguridad verificados', status: 'success' },
      { timestamp: this.getTimeAgo(15), action: 'Datos dimensionales sincronizados', status: 'info' },
      { timestamp: this.getTimeAgo(30), action: 'Base de datos accedida', status: 'info' },
      { timestamp: this.getTimeAgo(120), action: 'Escaneo de anomalías completado', status: 'warning' },
      { timestamp: this.getTimeAgo(360), action: 'Respaldo del sistema iniciado', status: 'success' }
    ];
  }

  private generateBio(level: number, name: string, username: string): AdminBio {
    const bios: Record<number, AdminBio> = {
      4: {
        codename: `OMEGA-${username.toUpperCase()}`,
        origin: 'Nexus Prime - Comando Central',
        backstory: `${name} fue reclutado por el Consejo Dimensional después de demostrar habilidades excepcionales durante el Incidente Cuántico de 2019. Como Director, tiene acceso total a todas las dimensiones y puede modificar la estructura misma del multiverso. Su misión principal es mantener el equilibrio entre las realidades paralelas y prevenir colapsos dimensionales.`,
        specialty: 'Manipulación de Anclajes de Realidad y Protocolos de Emergencia Omega',
        quote: '"El caos es solo orden que aún no hemos comprendido."'
      },
      3: {
        codename: `SIGMA-${username.toUpperCase()}`,
        origin: 'Ciudadela Zarek - División de Archivos',
        backstory: `${name} obtuvo acceso al rango de Comandante tras demostrar aptitud excepcional en gestión de información clasificada. Con acceso a los archivos más delicados de la organización, supervisa la integridad documental y coordina las operaciones de inteligencia dimensional.`,
        specialty: 'Gestión de Archivos Clasificados y Análisis de Inteligencia',
        quote: '"La información es el arma más poderosa del multiverso."'
      },
      2: {
        codename: `DELTA-${username.toUpperCase()}`,
        origin: 'División de Operaciones Especiales',
        backstory: `${name} ascendió al rango de Operador tras liderar exitosamente la Operación Bifrost. Especializado en coordinación interdimensional, supervisa las operaciones diarias y gestiona los equipos de monitoreo. Su experiencia en navegación cuántica lo convierte en un activo invaluable para el programa.`,
        specialty: 'Coordinación de Equipos y Análisis Dimensional',
        quote: '"Entre dimensiones, la comunicación es la clave."'
      },
      1: {
        codename: `GAMMA-${username.toUpperCase()}`,
        origin: 'Academia de Observadores',
        backstory: `${name} es un observador en entrenamiento, recientemente asignado al programa DIMENSION-2. Su rol es monitorear las fluctuaciones dimensionales y reportar anomalías al equipo senior. Aunque su acceso es limitado, su potencial ha sido reconocido por los oficiales de alto rango.`,
        specialty: 'Monitoreo de Señales y Detección de Anomalías',
        quote: '"Observar es el primer paso para entender."'
      }
    };

    return bios[level] || bios[1];
  }

  getLevelColor(): string {
    return this.permissionsService.getLevelColor();
  }

  getLevelName(): string {
    return this.permissionsService.getLevelName();
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private getTimeAgo(minutes: number): string {
    const date = new Date(Date.now() - minutes * 60000);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
