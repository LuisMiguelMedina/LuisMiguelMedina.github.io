import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('logContainer') logContainer!: ElementRef;

  logs: LogEntry[] = [];
  isLoading = false;
  autoScroll = true;
  private logInterval: any;

  // Server stats - Simulation of destroyed universe
  serverUptime = '129 días';
  memoryUsage = '1.2GB / 4GB';
  tps = '19.8';
  playersOnline = '4/4';
  simulationDate = '10 de Mayo, 1921';

  ngOnInit(): void {
    this.generateHistoricalLogs();
    this.startLogStream();
  }

  ngOnDestroy(): void {
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  }

  ngAfterViewChecked(): void {
    if (this.autoScroll && this.logContainer) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  private generateHistoricalLogs(): void {
    // Logs estilo servidor de mundo - simulación de universo destruido
    const historicalLogs: Omit<LogEntry, 'timestamp'>[] = [
      { level: 'INFO', source: 'Servidor', message: '=========== GOLDEN 21 WORLD SERVER v3.7.2 ===========' },
      { level: 'INFO', source: 'Servidor', message: 'Iniciando simulación de Dimensión-21...' },
      { level: 'INFO', source: 'WorldLoader', message: 'Cargando fragmento dimensional recuperado...' },
      { level: 'INFO', source: 'WorldLoader', message: 'Seed del universo: 0x4B454E4F42492D3231' },
      { level: 'INFO', source: 'WorldLoader', message: 'Fecha génesis: 1 de Enero, 1921 | Actual: 10 de Mayo, 1921' },
      { level: 'INFO', source: 'ChunkManager', message: 'Cargando región [Nueva York, 1921]... 847 chunks' },
      { level: 'INFO', source: 'ChunkManager', message: 'Región cargada en 2.3s - Edificios: 12,847 | Calles: 2,103' },
      { level: 'DEBUG', source: 'EntitySpawner', message: 'Spawneando población civil: 45,892 NPCs' },
      { level: 'INFO', source: 'ActorManager', message: 'Actor Ficticio [AF-001] spawneado en pos(234, 64, -892)' },
      { level: 'INFO', source: 'ActorManager', message: 'Actor Ficticio [AF-002] spawneado en pos(156, 72, -445)' },
      { level: 'INFO', source: 'ActorManager', message: 'Actor Ficticio [AF-003] spawneado en pos(-23, 68, 127)' },
      { level: 'INFO', source: 'ActorManager', message: 'Actor Ficticio [AF-004] spawneado en pos(892, 64, -234)' },
      { level: 'INFO', source: 'ActorManager', message: 'Actores Ficticios activos: 4/4 - Misión: Infiltración' },
      { level: 'DEBUG', source: 'PhysicsEngine', message: 'Motor de física inicializado - Tick rate: 20 TPS' },
      { level: 'INFO', source: 'TimeController', message: 'Día simulado: 129 | Velocidad: 1x tiempo real' },
      { level: 'DEBUG', source: 'AnchorSystem', message: 'Ancla-01 conectada - Estabilidad: 97%' },
      { level: 'WARN', source: 'AnchorSystem', message: 'Ancla-02 OFFLINE - Spark desincronizado' },
      { level: 'INFO', source: 'Servidor', message: '=====================================================' },
    ];

    // Add logs with timestamps going back a few minutes
    let minutesAgo = 15;
    historicalLogs.forEach((log) => {
      const timestamp = new Date(Date.now() - minutesAgo * 60000);
      this.logs.push({
        ...log,
        timestamp: this.formatTime(timestamp)
      });
      minutesAgo -= 0.5;
    });
  }

  private startLogStream(): void {
    // Generate random logs periodically - server is active
    this.logInterval = setInterval(() => {
      this.logs.push(this.generateRandomLog());
      // Keep only last 150 logs
      if (this.logs.length > 150) {
        this.logs.shift();
      }
    }, 2500 + Math.random() * 2000);
  }

  private generateRandomLog(): LogEntry {
    const chunkX = Math.floor(Math.random() * 200) - 100;
    const chunkZ = Math.floor(Math.random() * 200) - 100;
    const entityCount = Math.floor(Math.random() * 50) + 10;
    const npcId = Math.floor(Math.random() * 45000) + 1;
    const posX = Math.floor(Math.random() * 2000) - 1000;
    const posY = Math.floor(Math.random() * 40) + 60;
    const posZ = Math.floor(Math.random() * 2000) - 1000;

    const logTypes = [
      {
        level: 'DEBUG' as const, source: 'ChunkManager', messages: [
          `Chunk [${chunkX}, ${chunkZ}] cargado - ${entityCount} entidades`,
          `Descargando chunk inactivo [${chunkX}, ${chunkZ}] - memoria liberada`,
          `Renderizando región [${chunkX >> 5}, ${chunkZ >> 5}] - 32 chunks`,
          `Chunk rebuild completado en ${Math.floor(Math.random() * 50) + 10}ms`
        ]
      },
      {
        level: 'INFO' as const, source: 'WorldTick', messages: [
          `Tick procesado - TPS: ${(19 + Math.random()).toFixed(1)} | Entidades: ${Math.floor(45000 + Math.random() * 2000)}`,
          `Ciclo día/noche: ${Math.floor(Math.random() * 24000)} ticks | Clima: Despejado`,
          `Tiempo simulado avanzando... Día 129 activo`,
          `Guardado automático completado - ${Math.floor(Math.random() * 500) + 200} chunks`
        ]
      },
      {
        level: 'DEBUG' as const, source: 'EntitySpawner', messages: [
          `NPC #${npcId} pathfinding hacia destino - ${Math.floor(Math.random() * 100)}m`,
          `Spawneando vehículo en pos(${posX}, ${posY}, ${posZ})`,
          `Población activa: ${Math.floor(45000 + Math.random() * 1000)} NPCs | Vehículos: ${Math.floor(Math.random() * 500) + 200}`,
          `NPC #${npcId} rutina diaria: ${['Trabajo', 'Descanso', 'Tránsito', 'Social'][Math.floor(Math.random() * 4)]}`
        ]
      },
      {
        level: 'INFO' as const, source: 'ActorManager', messages: [
          'AF-001 interactuando con persona de interés',
          'AF-002 recopilando datos en ubicación objetivo',
          'AF-003 en posición de observación',
          'AF-004 siguiendo pista de evento pre-destrucción'
        ]
      },
      {
        level: 'WARN' as const, source: 'AnomalyDetector', messages: [
          `Fluctuación temporal detectada en chunk [${chunkX}, ${chunkZ}]`,
          'Patrón de destrucción similar detectado - Correlación: 67%',
          'Desfase de realidad menor corregido automáticamente',
          'Inconsistencia en física de entidad - Recalculando...'
        ]
      },
      {
        level: 'DEBUG' as const, source: 'PhysicsEngine', messages: [
          `Colisiones procesadas: ${Math.floor(Math.random() * 1000) + 500} | Tick: ${Math.floor(Math.random() * 20) + 30}ms`,
          'Simulación de fluidos estable - Sin overflow',
          `Gravedad: 9.8m/s² | Fricción: Normal | Entidades físicas: ${Math.floor(Math.random() * 200) + 100}`,
          'Motor de física sincronizado con servidor'
        ]
      },
      {
        level: 'WARN' as const, source: 'BugTracker', messages: [
          `NPC #${npcId} stuck en posición - Teleporting a spawn`,
          'Textura faltante: building_1921_facade_03 - Usando fallback',
          'Z-fighting detectado en edificio [Hotel Manhattan] - Ajustando',
          `Entidad flotando en pos(${posX}, ${posY + 5}, ${posZ}) - Corrigiendo Y`
        ]
      },
      {
        level: 'ERROR' as const, source: 'WorldLoader', messages: [
          `Chunk [${chunkX}, ${chunkZ}] corruption detectada - Regenerando`,
          'Timeout en carga de región - Reintentando...',
          'Ancla-02 sin respuesta - Estabilidad comprometida'
        ]
      },
      {
        level: 'INFO' as const, source: 'AnchorSystem', messages: [
          'Ancla-01: Heartbeat OK - Integridad 97%',
          'Estabilidad dimensional: NORMAL',
          'Conteniendo micro-fisuras de realidad',
          'Sincronización con fragmento dimensional: 100%'
        ]
      },
      {
        level: 'ERROR' as const, source: 'Ancla-02', messages: [
          'OFFLINE - Sin señal de Spark',
          'Último heartbeat: hace 73 horas',
          'Requiere intervención de personal Ultra'
        ]
      },
      {
        level: 'INFO' as const, source: 'DataLogger', messages: [
          'Evento histórico registrado para análisis',
          'Correlación con destrucción: Calculando...',
          'Datos enviados a Los Archivos',
          'Backup de simulación: 33% reconstruido'
        ]
      }
    ];

    const type = logTypes[Math.floor(Math.random() * logTypes.length)];
    const message = type.messages[Math.floor(Math.random() * type.messages.length)];

    return {
      timestamp: this.formatTime(new Date()),
      level: type.level,
      source: type.source,
      message
    };
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  clearLogs(): void {
    this.logs = [];
    this.logs.push({
      timestamp: this.formatTime(new Date()),
      level: 'INFO',
      source: 'Console',
      message: 'Log buffer cleared by administrator'
    });
  }

  toggleAutoScroll(): void {
    this.autoScroll = !this.autoScroll;
  }
}
