import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { PermissionsService } from '../../services/permissions.service';

interface DimensionStatus {
  id: number;
  name: string;
  status: 'STABLE' | 'UNSTABLE' | 'CRITICAL' | 'CONTAINED';
  integrity: number;
  lastSync: string;
  color: string;
}

interface ServerMetric {
  label: string;
  value: string;
  icon: string;
  color: string;
  subtext?: string;
}

interface RecentEvent {
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  permissionsService = inject(PermissionsService);

  adminSession = this.permissionsService.adminSession;
  adminLevel = this.permissionsService.adminLevel;

  // Server Stats - Simulated Universe
  serverUptime = '129 días';
  serverGenesis = '1 de Enero, 1921';
  simulationDate = '10 de Mayo, 1921';
  totalAgents = 4;
  activeAgents = 4;

  // Dimension Status
  dimensions: DimensionStatus[] = [
    {
      id: 1,
      name: 'DIMENSION-1',
      status: 'STABLE',
      integrity: 97.3,
      lastSync: '2 min ago',
      color: '#00ff00'
    },
    {
      id: 2,
      name: 'DIMENSION-2 (THE MADNESS)',
      status: 'CONTAINED',
      integrity: 84.7,
      lastSync: '5 min ago',
      color: '#ff5555'
    }
  ];

  // Server Metrics
  metrics: ServerMetric[] = [];

  // Recent Events
  recentEvents: RecentEvent[] = [];

  // Real-time counters
  private updateInterval: any;
  currentTPS = 19.8;
  memoryUsed = 1.2;
  memoryTotal = 4;
  networkPing = 23;

  ngOnInit(): void {
    this.generateMetrics();
    this.generateRecentEvents();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private generateMetrics(): void {
    this.metrics = [
      {
        label: 'Tiempo de Simulación',
        value: this.serverUptime,
        icon: 'fas fa-hourglass-half',
        color: 'cyan',
        subtext: `Fecha actual: ${this.simulationDate}`
      },
      {
        label: 'Agentes Activos',
        value: this.activeAgents.toString(),
        icon: 'fas fa-users',
        color: 'green',
        subtext: `${this.totalAgents} asignados al proyecto`
      },
      {
        label: 'Puentes Multiversales',
        value: '2',
        icon: 'fas fa-network-wired',
        color: 'purple',
        subtext: 'Dimensiones conectadas'
      },
      {
        label: 'Anclas de Realidad',
        value: '1 / 2',
        icon: 'fas fa-anchor',
        color: 'amber',
        subtext: '1 operacional, 1 inactivo'
      }
    ];
  }

  private generateRecentEvents(): void {
    this.recentEvents = [
      {
        timestamp: new Date(Date.now() - 2 * 60000),
        type: 'success',
        source: 'SimulaciónCore',
        message: 'Checkpoint de simulación creado - Día 129'
      },
      {
        timestamp: new Date(Date.now() - 15 * 60000),
        type: 'info',
        source: 'AnálisisTemporal',
        message: 'Analizando eventos previos a la destrucción...'
      },
      {
        timestamp: new Date(Date.now() - 45 * 60000),
        type: 'warning',
        source: 'DetectorAnomalías',
        message: 'Divergencia temporal detectada en línea base'
      },
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        type: 'info',
        source: 'ProyectoGolden21',
        message: 'Sesión de observación iniciada'
      },
      {
        timestamp: new Date(Date.now() - 6 * 60 * 60000),
        type: 'success',
        source: 'Ancla-01',
        message: 'Ancla de realidad estable - Integridad 97%'
      },
      {
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
        type: 'error',
        source: 'Ancla-02',
        message: 'Ancla secundaria fuera de línea - Requiere recalibración'
      }
    ];
  }

  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      // Simulate real-time fluctuations
      this.currentTPS = 19 + Math.random() * 1.5;
      this.memoryUsed = 1 + Math.random() * 0.5;
      this.networkPing = 20 + Math.floor(Math.random() * 10);

      // Occasionally update dimension integrity
      if (Math.random() > 0.7) {
        this.dimensions[0].integrity = 96 + Math.random() * 3;
        this.dimensions[1].integrity = 83 + Math.random() * 4;
      }
    }, 3000);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'STABLE': return 'status-stable';
      case 'UNSTABLE': return 'status-unstable';
      case 'CRITICAL': return 'status-critical';
      case 'CONTAINED': return 'status-contained';
      default: return '';
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'error': return 'fas fa-times-circle';
      default: return 'fas fa-info-circle';
    }
  }
}
