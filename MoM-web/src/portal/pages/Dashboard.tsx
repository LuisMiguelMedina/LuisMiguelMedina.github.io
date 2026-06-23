// Server Analysis dashboard for the Multiverse of Madness portal.
// Ported faithfully from the legacy Angular Dashboard component
// (.legacy-angular/.../components/dashboard). Keeps: live header stats,
// genesis banner, metric cards, dimension status grid, recent events,
// permission-gated system resources (level >= 2) and level-1 restricted notice.
// Spanish UI text preserved.
import { useEffect, useRef, useState } from 'react';
import { ref, set, get, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth';
import './Dashboard.scss';

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

// Static server constants (Simulated Universe).
const SERVER_UPTIME = '129 días';
const SERVER_GENESIS = '1 de Enero, 1921';
const SIMULATION_DATE = '10 de Mayo, 1921';
const TOTAL_AGENTS = 4;
const ACTIVE_AGENTS = 4;
const MEMORY_TOTAL = 4;

const METRICS: ServerMetric[] = [
  {
    label: 'Tiempo de Simulación',
    value: SERVER_UPTIME,
    icon: 'fas fa-hourglass-half',
    color: 'cyan',
    subtext: `Fecha actual: ${SIMULATION_DATE}`,
  },
  {
    label: 'Agentes Activos',
    value: ACTIVE_AGENTS.toString(),
    icon: 'fas fa-users',
    color: 'green',
    subtext: `${TOTAL_AGENTS} asignados al proyecto`,
  },
  {
    label: 'Puentes Multiversales',
    value: '2',
    icon: 'fas fa-network-wired',
    color: 'purple',
    subtext: 'Dimensiones conectadas',
  },
  {
    label: 'Anclas de Realidad',
    value: '1 / 2',
    icon: 'fas fa-anchor',
    color: 'amber',
    subtext: '1 operacional, 1 inactivo',
  },
];

function buildRecentEvents(): RecentEvent[] {
  const now = Date.now();
  return [
    {
      timestamp: new Date(now - 2 * 60000),
      type: 'success',
      source: 'SimulaciónCore',
      message: 'Checkpoint de simulación creado - Día 129',
    },
    {
      timestamp: new Date(now - 15 * 60000),
      type: 'info',
      source: 'AnálisisTemporal',
      message: 'Analizando eventos previos a la destrucción...',
    },
    {
      timestamp: new Date(now - 45 * 60000),
      type: 'warning',
      source: 'DetectorAnomalías',
      message: 'Divergencia temporal detectada en línea base',
    },
    {
      timestamp: new Date(now - 2 * 60 * 60000),
      type: 'info',
      source: 'ProyectoGolden21',
      message: 'Sesión de observación iniciada',
    },
    {
      timestamp: new Date(now - 6 * 60 * 60000),
      type: 'success',
      source: 'Ancla-01',
      message: 'Ancla de realidad estable - Integridad 97%',
    },
    {
      timestamp: new Date(now - 24 * 60 * 60000),
      type: 'error',
      source: 'Ancla-02',
      message: 'Ancla secundaria fuera de línea - Requiere recalibración',
    },
  ];
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'STABLE':
      return 'status-stable';
    case 'UNSTABLE':
      return 'status-unstable';
    case 'CRITICAL':
      return 'status-critical';
    case 'CONTAINED':
      return 'status-contained';
    default:
      return '';
  }
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'error':
      return 'fas fa-times-circle';
    default:
      return 'fas fa-info-circle';
  }
}

// Port of the Angular `| date:'short'` pipe (en-US short date + time).
function formatShortDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function Dashboard() {
  const { session, level } = useAuth();

  // Firebase connection status.
  const [isConnected, setIsConnected] = useState(false);

  // Real-time counters.
  const [currentTPS, setCurrentTPS] = useState(19.8);
  const [memoryUsed, setMemoryUsed] = useState(1.2);
  const [networkPing, setNetworkPing] = useState(23);

  // Dimension status (mutated by the real-time updater).
  const [dimensions, setDimensions] = useState<DimensionStatus[]>([
    {
      id: 1,
      name: 'DIMENSION-1',
      status: 'CRITICAL',
      integrity: 7.3,
      lastSync: '2 min ago',
      color: '#ff5555',
    },
    {
      id: 2,
      name: 'DIMENSION-2 (Simulated Universe)',
      status: 'STABLE',
      integrity: 41,
      lastSync: '5 min ago',
      color: '#00ff00',
    },
  ]);

  // Recent events are generated once on mount (timestamps relative to load).
  const [recentEvents] = useState<RecentEvent[]>(() => buildRecentEvents());

  // Keep the latest networkPing setter reachable from the interval/async fns.
  const pingRef = useRef(setNetworkPing);
  pingRef.current = setNetworkPing;

  // Firebase connection monitoring + latency measurement.
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      setIsConnected(snapshot.val() === true);
    });

    const measureFirebaseLatency = async (): Promise<void> => {
      try {
        const start = performance.now();
        const stamp = Date.now();
        const pingDbRef = ref(db, `_ping/${stamp}`);
        await set(pingDbRef, stamp);
        await get(pingDbRef);
        const latency = Math.round(performance.now() - start);
        pingRef.current(latency);
      } catch (error) {
        console.error('Error measuring Firebase latency:', error);
        pingRef.current(-1);
      }
    };

    void measureFirebaseLatency();

    const updateInterval = window.setInterval(() => {
      setCurrentTPS(19 + Math.random() * 1.5);
      setMemoryUsed(1 + Math.random() * 0.5);

      void measureFirebaseLatency();

      if (Math.random() > 0.7) {
        setDimensions((prev) =>
          prev.map((dim, idx) =>
            idx === 0
              ? { ...dim, integrity: 96 + Math.random() * 3 }
              : idx === 1
                ? { ...dim, integrity: 83 + Math.random() * 4 }
                : dim,
          ),
        );
      }
    }, 10000);

    return () => {
      window.clearInterval(updateInterval);
      off(connectedRef);
    };
  }, []);

  const memoryPct = (memoryUsed / MEMORY_TOTAL) * 100;

  return (
    <>
      {/* Dashboard Header */}
      <div className="matrix-page-header">
        <div className="header-title">
          <h3>
            <i className="fas fa-server me-2" />
            Análisis del Servidor
          </h3>
          {session && <div className="welcome-text">&gt; CENTRO DE CONTROL — ZRK INTRANET</div>}
        </div>
        <div className="header-stats">
          <div className="live-stat">
            <span className="stat-label">TPS:</span>
            <span className="stat-value green">{currentTPS.toFixed(1)}</span>
          </div>
          <div className="live-stat">
            <span className="stat-label">MEM:</span>
            <span className="stat-value amber">
              {memoryUsed.toFixed(1)}GB/{MEMORY_TOTAL}GB
            </span>
          </div>
          <div className="live-stat">
            <span className="stat-label">FIREBASE:</span>
            {networkPing >= 0 ? (
              <span className="stat-value cyan">{networkPing}ms</span>
            ) : (
              <span className="stat-value red">ERROR</span>
            )}
          </div>
          <div className="live-stat">
            <span className="stat-label">DB:</span>
            {isConnected ? (
              <span className="stat-value green">
                <i className="fas fa-circle" /> CONECTADO
              </span>
            ) : (
              <span className="stat-value red">
                <i className="fas fa-circle" /> DESCONECTADO
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Server Genesis Banner */}
      <div className="genesis-banner">
        <div className="genesis-content">
          <div className="genesis-icon">
            <i className="fas fa-infinity" />
          </div>
          <div className="genesis-info">
            <div className="genesis-label">INICIO DEL SERVIDOR</div>
            <div className="genesis-date">{SERVER_GENESIS}</div>
          </div>
          <div className="genesis-divider" />
          <div className="genesis-info">
            <div className="genesis-label">TIEMPO TOTAL</div>
            <div className="genesis-date">{SERVER_UPTIME}</div>
          </div>
          <div className="genesis-divider" />
          <div className="genesis-info">
            <div className="genesis-label">ESTADO</div>
            <div className="genesis-date">
              <span className="status-online">
                <i className="fas fa-circle" /> OPERATIVO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards Row */}
      <div className="row mb-4">
        {METRICS.map((metric) => (
          <div className="col-md-6 col-xl-3 mb-4" key={metric.label}>
            <div className="matrix-card" data-color={metric.color}>
              <div className="card-body">
                <div className="row g-0 align-items-center">
                  <div className="col me-2">
                    <div className="card-label">{metric.label}</div>
                    <div className="card-value">{metric.value}</div>
                    {metric.subtext && <div className="card-subtext">{metric.subtext}</div>}
                  </div>
                  <div className="col-auto">
                    <i className={metric.icon + ' card-icon'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dimension Status Row */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="matrix-chart-container">
            <div className="chart-header">
              <h6>
                <i className="fas fa-globe-americas me-2" />
                Estado de Dimensiones
              </h6>
            </div>
            <div className="dimension-grid">
              {dimensions.map((dim) => (
                <div className={`dimension-card ${getStatusClass(dim.status)}`} key={dim.id}>
                  <div className="dimension-header">
                    <span className="dimension-name">{dim.name}</span>
                    <span className="dimension-status">
                      {dim.status === 'CRITICAL' && (
                        <i className="fas fa-exclamation-triangle critical-icon" />
                      )}
                      {dim.status}
                    </span>
                  </div>
                  <div className="dimension-body">
                    <div className="integrity-row">
                      <span className="integrity-label">Integridad:</span>
                      <span className="integrity-value">{dim.integrity.toFixed(1)}%</span>
                    </div>
                    <div className="integrity-bar">
                      <div
                        className="integrity-fill"
                        style={{ width: `${dim.integrity}%`, background: dim.color }}
                      />
                    </div>
                    <div className="sync-info">
                      <i className="fas fa-sync-alt" />
                      Última sync: {dim.lastSync}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity and System Status Row */}
      <div className="row">
        {/* Recent Events */}
        <div className="col-lg-7 mb-4">
          <div className="matrix-chart-container">
            <div className="chart-header">
              <h6>
                <i className="fas fa-history me-2" />
                Eventos Recientes
              </h6>
            </div>
            <div className="events-list">
              {recentEvents.map((event) => (
                <div className={`event-item ${event.type}`} key={event.timestamp.getTime()}>
                  <div className="event-icon">
                    <i className={getEventIcon(event.type)} />
                  </div>
                  <div className="event-content">
                    <div className="event-header">
                      <span className="event-source">[{event.source}]</span>
                      <span className="event-time">{formatShortDate(event.timestamp)}</span>
                    </div>
                    <div className="event-message">{event.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Resources - Level 2+ */}
        {level >= 2 && (
          <div className="col-lg-5 mb-4">
            <div className="matrix-chart-container">
              <div className="chart-header">
                <h6>
                  <i className="fas fa-microchip me-2" />
                  Recursos del Sistema
                </h6>
              </div>
              <div className="p-3">
                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">USO_CPU:</span>
                    <span className="resource-value green">42%</span>
                  </div>
                  <div className="matrix-progress progress">
                    <div className="progress-bar" style={{ width: '42%' }} />
                  </div>
                </div>

                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">USO_MEMORIA:</span>
                    <span className="resource-value amber">{memoryPct.toFixed(0)}%</span>
                  </div>
                  <div className="matrix-progress progress">
                    <div className="progress-bar amber" style={{ width: `${memoryPct}%` }} />
                  </div>
                </div>

                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">USO_DISCO:</span>
                    <span className="resource-value cyan">35%</span>
                  </div>
                  <div className="matrix-progress progress">
                    <div className="progress-bar" style={{ width: '35%' }} />
                  </div>
                </div>

                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">ANCLAJES_REALIDAD:</span>
                    <span className="resource-value green">
                      <i className="fas fa-check-circle me-1" />1/2 ACTIVOS
                    </span>
                  </div>
                </div>

                <div className="resource-item">
                  <div className="resource-header">
                    <span className="resource-label">CAMPO_CONTENCION:</span>
                    <span className="resource-value amber">
                      <i className="fas fa-shield-alt me-1" />ESTABLE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Level 1 Restricted Message */}
      {level < 2 && (
        <div className="row">
          <div className="col-12">
            <div className="matrix-chart-container text-center" style={{ padding: '3rem' }}>
              <i
                className="fas fa-lock"
                style={{
                  fontSize: '3rem',
                  color: 'var(--terminal-gray)',
                  marginBottom: '1rem',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-terminal)',
                  color: 'var(--terminal-gray)',
                  letterSpacing: '2px',
                }}
              >
                [ NIVEL DE ACCESO INSUFICIENTE ]
              </p>
              <small style={{ color: 'var(--terminal-cyan-dim)' }}>
                Métricas avanzadas del sistema requieren nivel 2 o superior
              </small>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
