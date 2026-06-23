import { Component, inject, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CacheService } from '../../services/cache.service';

interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

@Component({
  selector: 'app-memory-monitor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="memory-monitor" [class.warning]="memoryUsage() > 80" [class.critical]="memoryUsage() > 90">
      <div class="monitor-header">
        <h6>Monitoreo de Memoria</h6>
        <button (click)="toggleExpanded()" class="btn-toggle">
          {{ expanded() ? '−' : '+' }}
        </button>
      </div>

      @if (expanded()) {
        <div class="monitor-content">
          <div class="memory-stat">
            <span>Uso de Memoria:</span>
            <span class="value">{{ memoryUsage() }}%</span>
          </div>

          <div class="memory-stat">
            <span>Heap Usado:</span>
            <span class="value">{{ formatBytes(memoryInfo()?.usedJSHeapSize || 0) }}</span>
          </div>

          <div class="memory-stat">
            <span>Heap Total:</span>
            <span class="value">{{ formatBytes(memoryInfo()?.totalJSHeapSize || 0) }}</span>
          </div>

          <div class="memory-stat">
            <span>Cache Usado:</span>
            <span class="value">{{ cacheStats().usagePercentage }}%</span>
          </div>

          <div class="actions">
            <button (click)="clearCache()" class="btn-action">Limpiar Cache</button>
            <button (click)="forceGC()" class="btn-action">Forzar GC</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .memory-monitor {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      min-width: 200px;
      z-index: 9999;
      backdrop-filter: blur(10px);
    }

    .memory-monitor.warning {
      background: rgba(255, 193, 7, 0.9);
      color: black;
    }

    .memory-monitor.critical {
      background: rgba(220, 53, 69, 0.9);
      color: white;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .monitor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }

    .monitor-header h6 {
      margin: 0;
      font-size: 14px;
    }

    .btn-toggle {
      background: none;
      border: 1px solid currentColor;
      color: inherit;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
    }

    .memory-stat {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
    }

    .value {
      font-weight: bold;
    }

    .actions {
      margin-top: 10px;
      display: flex;
      gap: 5px;
    }

    .btn-action {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid currentColor;
      color: inherit;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 10px;
      flex: 1;
    }

    .btn-action:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class MemoryMonitorComponent implements OnInit, OnDestroy {
  private cacheService = inject(CacheService);
  private intervalId: number | null = null;

  private memoryInfoSignal = signal<MemoryInfo | null>(null);
  private expandedSignal = signal(false);

  expanded = this.expandedSignal.asReadonly();
  memoryInfo = this.memoryInfoSignal.asReadonly();
  cacheStats = this.cacheService.memoryStats;

  memoryUsage = computed(() => {
    const info = this.memoryInfo();
    if (!info) return 0;
    return Math.round((info.usedJSHeapSize / info.totalJSHeapSize) * 100);
  });

  ngOnInit(): void {
    // Only show in development environment
    if (!this.isProduction()) {
      this.startMonitoring();
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startMonitoring(): void {
    this.updateMemoryInfo();
    this.intervalId = window.setInterval(() => {
      this.updateMemoryInfo();
    }, 2000);
  }

  private updateMemoryInfo(): void {
    // @ts-ignore - performance.memory might not be available in all browsers
    const memInfo = (performance as any).memory;
    if (memInfo) {
      this.memoryInfoSignal.set({
        usedJSHeapSize: memInfo.usedJSHeapSize,
        totalJSHeapSize: memInfo.totalJSHeapSize,
        jsHeapSizeLimit: memInfo.jsHeapSizeLimit
      });
    }
  }

  toggleExpanded(): void {
    this.expandedSignal.update(expanded => !expanded);
  }

  clearCache(): void {
    this.cacheService.clear();
    console.log('Cache cleared manually');
  }

  forceGC(): void {
    // @ts-ignore - gc might not be available
    if ((window as any).gc) {
      (window as any).gc();
      console.log('Garbage collection forced');
    } else {
      console.warn('Garbage collection not available. Run with --expose-gc flag.');
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private isProduction(): boolean {
    return !location.hostname.includes('localhost') && !location.hostname.includes('127.0.0.1');
  }
}
