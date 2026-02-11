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
    // Logs for simulating a destroyed universe to analyze its destruction
    const historicalLogs: Omit<LogEntry, 'timestamp'>[] = [
      { level: 'INFO', source: 'Servidor', message: '===================================================' },
      { level: 'INFO', source: 'Servidor', message: 'PROYECTO GOLDEN 21 - Simulación de Dimensión 21' },
      { level: 'INFO', source: 'Servidor', message: 'Objetivo: Reconstruir eventos que llevaron a la destrucción' },
      { level: 'INFO', source: 'Servidor', message: 'Génesis de Simulación: 1 de Enero, 1921' },
      { level: 'INFO', source: 'Servidor', message: 'Fecha Actual Simulada: 10 de Mayo, 1921 (Día 129)' },
      { level: 'INFO', source: 'Servidor', message: '===================================================' },
      { level: 'INFO', source: 'SimulaciónCore', message: 'Universo simulado inicializado correctamente' },
      { level: 'INFO', source: 'SimulaciónCore', message: 'Parámetros de realidad cargados desde fragmento recuperado' },
      { level: 'DEBUG', source: 'AnclaRealidad', message: 'Ancla-01: Integridad 97% - Operacional' },
      { level: 'WARN', source: 'AnclaRealidad', message: 'Ancla-02: Fuera de línea - Requiere recalibración del Spark' },
      { level: 'INFO', source: 'RegistroAgentes', message: 'Agentes asignados al proyecto: 4' },
      { level: 'INFO', source: 'RegistroAgentes', message: 'Líder del proyecto: Katherine M.2' },
      { level: 'INFO', source: 'AnálisisTemporal', message: 'Buscando puntos de divergencia críticos...' },
      { level: 'WARN', source: 'DetectorAnomalías', message: 'Eventos pre-destrucción detectados en línea temporal' },
      { level: 'INFO', source: 'Archivos', message: 'Datos históricos del universo destruido: 33% reconstruidos' },
      { level: 'INFO', source: 'ProyectoGolden21', message: 'Fase actual: Observación y mapeo de causalidad' },
      { level: 'INFO', source: 'Servidor', message: '---------------------------------------------------' },
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
    const logTypes = [
      {
        level: 'INFO' as const, source: 'SimulaciónCore', messages: [
          'Checkpoint de simulación guardado - Día 129',
          'Procesando eventos históricos del universo destruido...',
          'Datos de simulación sincronizados con fragmento dimensional',
          'Verificando integridad de línea temporal: OK'
        ]
      },
      {
        level: 'INFO' as const, source: 'AnálisisTemporal', messages: [
          'Analizando cadena de eventos pre-destrucción',
          'Mapeando puntos de divergencia en línea temporal',
          'Correlacionando datos con registros de Los Archivos',
          'Identificando actores clave en colapso dimensional'
        ]
      },
      {
        level: 'DEBUG' as const, source: 'Rendimiento', messages: [
          `Memoria: ${(Math.random() * 1.5 + 0.8).toFixed(1)}GB/4GB | TPS: ${(19 + Math.random()).toFixed(1)}`,
          `Entidades simuladas: ${Math.floor(1500 + Math.random() * 500)}`,
          `Tick: ${Math.floor(40 + Math.random() * 10)}ms | Estable`,
          'Optimización de recursos completada'
        ]
      },
      {
        level: 'WARN' as const, source: 'DetectorAnomalías', messages: [
          'Patrón de destrucción detectado - Analizando causas',
          'Fluctuación en membrana dimensional de simulación',
          'Evento crítico aproximándose en línea temporal simulada',
          'Similitud con patrones de Legión Antimateria: 67%'
        ]
      },
      {
        level: 'INFO' as const, source: 'ProyectoGolden21', messages: [
          'Progreso de reconstrucción: 33%',
          'Katherine M.2 supervisando simulación',
          'Nuevos datos extraídos del fragmento dimensional',
          'Hipótesis de destrucción actualizada'
        ]
      },
      {
        level: 'INFO' as const, source: 'AnclaRealidad', messages: [
          'Ancla-01: Pulso de estabilidad confirmado',
          'Integridad de simulación: 97%',
          'Conteniendo desviaciones de realidad',
          'Ancla-02 pendiente de reparación por Ultra'
        ]
      },
      {
        level: 'ERROR' as const, source: 'Ancla-02', messages: [
          'Ancla secundaria sin respuesta',
          'Requiere calibración del Spark para reactivación'
        ]
      },
      {
        level: 'INFO' as const, source: 'Archivos', messages: [
          'Registros históricos indexados correctamente',
          'Comparando con eventos conocidos de otras dimensiones',
          'Documentación de hallazgos en progreso'
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
