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

  // Server stats - established since 1921
  serverUptime = '38,352 days';
  memoryUsage = '1.2GB / 4GB';
  tps = '19.8';
  playersOnline = '7/100';
  dimensionAge = 'Est. 1921';

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
    // Show logs as if server has been running and this is a recent session
    const historicalLogs: Omit<LogEntry, 'timestamp'>[] = [
      { level: 'INFO', source: 'Server', message: '===================================================' },
      { level: 'INFO', source: 'Server', message: 'DIMENSION-2 SERVER - Session Resumed' },
      { level: 'INFO', source: 'Server', message: 'Original Genesis: January 1, 1921 00:00:00 UTC' },
      { level: 'INFO', source: 'Server', message: 'Total Runtime: 38,352 days (105+ years)' },
      { level: 'INFO', source: 'Server', message: '===================================================' },
      { level: 'INFO', source: 'DimensionCore', message: 'Dimension-1 [OVERWORLD] - Status: STABLE since 1921' },
      { level: 'INFO', source: 'DimensionCore', message: 'Dimension-2 [THE_MADNESS] - Status: CONTAINED' },
      { level: 'DEBUG', source: 'RealityAnchor', message: 'Anchor integrity: 97.3% - Minor dimensional drift detected' },
      { level: 'WARN', source: 'TemporalWatch', message: 'Timeline variance +0.003ms from prime reality' },
      { level: 'INFO', source: 'PlayerRegistry', message: 'Loading player database... 2,847 registered agents' },
      { level: 'INFO', source: 'PlayerRegistry', message: 'Active agents this session: 7' },
      { level: 'INFO', source: 'Security', message: 'Encryption: QUANTUM-256 (upgraded from AES-256 in 2019)' },
      { level: 'INFO', source: 'Network', message: 'Multiverse bridge: CONNECTED to 13 parallel instances' },
      { level: 'DEBUG', source: 'Watchdog', message: 'Memory defrag completed - Freed 847MB' },
      { level: 'INFO', source: 'EventLog', message: 'Last major incident: Amanda\'s Quantic Travels' },
      { level: 'INFO', source: 'EventLog', message: 'Days since last containment breach: 2,191' },
      { level: 'INFO', source: 'AdminModule', message: 'Console ready - Welcome back, Administrator' },
      { level: 'INFO', source: 'Server', message: '---------------------------------------------------' },
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
        level: 'INFO' as const, source: 'AutoSave', messages: [
          'World saved. Chunks: 4,721 | Entities: 1,847',
          'Backing up dimension-1 to archive-1921...',
          'Player data synchronized',
          'Checkpoint created: CP-' + Math.floor(Math.random() * 99999)
        ]
      },
      {
        level: 'INFO' as const, source: 'PlayerTracker', messages: [
          'Agent OMEGA-ADMIN001 accessed sector 7G',
          'Dimension transfer: Agent moved D1 -> D2',
          'Player activity spike in zone ALPHA-12',
          'New session started by authorized personnel'
        ]
      },
      {
        level: 'DEBUG' as const, source: 'Performance', messages: [
          `Memory: ${(Math.random() * 1.5 + 0.8).toFixed(1)}GB/4GB | TPS: ${(19 + Math.random()).toFixed(1)}`,
          `Entity count: ${Math.floor(1500 + Math.random() * 500)}`,
          `Tick: ${Math.floor(40 + Math.random() * 10)}ms | Stable`,
          'Garbage collection: 147ms'
        ]
      },
      {
        level: 'WARN' as const, source: 'AnomalyDetector', messages: [
          'Minor reality fluctuation in sector 9',
          'Temporal echo detected - non-critical',
          'Dimensional membrane stress: 12% above normal',
          'Pattern match: Similar to 1987 incident (contained)'
        ]
      },
      {
        level: 'INFO' as const, source: 'DimensionSync', messages: [
          'Inter-dimension heartbeat: 847ms',
          'Reality anchor pulse confirmed',
          'Parallel instance #7 synchronized',
          'Madness containment: HOLDING'
        ]
      },
      {
        level: 'INFO' as const, source: 'Chronicle', messages: [
          'Day 38,352 of continuous operation',
          'Historical data archived successfully',
          'Genesis timestamp verified: 1921-01-01',
          '105th anniversary protocols active'
        ]
      },
      {
        level: 'ERROR' as const, source: 'Security', messages: [
          'Unauthorized access attempt blocked - Origin: Unknown',
          'Firewall triggered: Intrusion from void space'
        ]
      },
      {
        level: 'INFO' as const, source: 'Network', messages: [
          'Ping to parallel dimension: 23ms',
          'Multiverse bridge stable',
          'Data packet received from archive node'
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
