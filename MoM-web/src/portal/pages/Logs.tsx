import { useEffect, useRef, useState } from 'react';
import './Logs.scss';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

interface BugReport {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  estado: 'abierto' | 'investigando' | 'contenido' | 'resuelto';
  fuente: string;
  fecha: string;
  detalles: string;
}

const BUGS: BugReport[] = [
  {
    id: 'BUG-001',
    titulo: 'Supresión inesperada - Código "Propagación"',
    descripcion: 'Actor Ficticio "Telemachus" ha vulnerado el código "Propagación" mediante el uso de "Calm Emotions". La enfermedad de la Propagación sufrió una supresión inesperada que desestabilizó los parámetros de contención del servidor de simulación.',
    prioridad: 'critica',
    estado: 'contenido',
    fuente: 'SecurityBreach',
    fecha: 'Ciclo 21.4 - Día 127',
    detalles: 'La brecha fue detectada cuando Telemachus ejecutó "Calm Emotions" sobre una entidad afectada por la Propagación. La supresión emocional causó una reacción no prevista en el código de la enfermedad, suprimiendo su expansión temporalmente y desestabilizando la programación actual. El incidente fue contenido mediante intervención directa de Ancla-01, que restableció los parámetros originales de la Propagación. Protocolos de seguridad reforzados.'
  },
  {
    id: 'BUG-002',
    titulo: 'Daño a integridad - Código "Propagación"',
    descripcion: 'Actor Ficticio "Alerce" ha causado un daño a la integridad del código "Propagación" al curar un fragmento del código malicioso. La acción comprometió la programación actual de la enfermedad dentro de la simulación.',
    prioridad: 'alta',
    estado: 'investigando',
    fuente: 'IntegrityMonitor',
    fecha: 'Ciclo 21.4 - Día 128',
    detalles: 'Alerce logró curar un pedazo del código malicioso de la Propagación, lo cual no estaba previsto en los parámetros de la simulación. Esta acción generó una cascada de errores en la integridad del código que mantiene la secuencia de la "Propagación" activa. Al sanar parte de la enfermedad, la programación actual fue afectada de forma imprevista, alterando el comportamiento esperado de la Propagación en la zona. El daño al código fue parcialmente estabilizado pero la investigación sobre el alcance total continúa.'
  },
  {
    id: 'BUG-003',
    titulo: 'Ingreso no autorizado al Cristal del Tiempo',
    descripcion: 'Glenn Eldric ha ingresado al Cristal del Tiempo de la dimensión por causas desconocidas. El método de acceso involucra una conexión con una entidad no catalogada denominada "El Arcano", quien aparece en lineas de código como "Δ".',
    prioridad: 'critica',
    estado: 'investigando',
    fuente: 'CoreAccess',
    fecha: 'Ciclo 21.4 - Día 128',
    detalles: 'Glenn accedió al Cristal del Tiempo mediante su conexión con Δ, una entidad desconocida que no forma parte de los parámetros originales de la simulación. El método exacto de ingreso es desconocido y está siendo investigado. Esta misma entidad ha sido vinculada a otros errores y anomalías detectadas en el sistema. Protocolos de demolición y contención fueron activados. Se desconoce qué información Glenn pudo haber accedido dentro del Cristal del Tiempo. ADVERTENCIA: Δ representa una variable no controlada dentro de la simulación.'
  },
  {
    id: 'BUG-004',
    titulo: 'Desconexión inesperada - Actor Ficticio Freddy',
    descripcion: 'Pérdida total de señal con Actor Ficticio Freddy (Golem). La desconexión coincidió con un episodio severo de esquizofrenia del golem que sobrecargó los sistemas de contención de su entidad.',
    prioridad: 'alta',
    estado: 'abierto',
    fuente: 'ActorManager',
    fecha: 'Ciclo 21.4 - Día 129',
    detalles: 'Freddy, un golem con una IA de personalidad compleja, presentaba niveles de esquizofrenia que venían escalando desde el Día 120. El sistema de contención de su entidad se sobrecargó al intentar procesar múltiples estados de consciencia simultáneos. La última telemetría indica que el golem se encontraba en la tienda "Arcana". No se ha logrado restablecer la conexión. La integridad de la simulación en su zona fue comprometida.'
  },
  {
    id: 'BUG-005',
    titulo: 'Desconexión inesperada - Actor Ficticio Clorinde',
    descripcion: 'Pérdida total de rastreo de consciencia con Actor Ficticio Clorinde. La conexión neuronal con el sistema de la Ciudadela ha dejado de responder por causas desconocidas.',
    prioridad: 'alta',
    estado: 'abierto',
    fuente: 'ActorManager',
    fecha: 'Ciclo 21.4 - Día 129',
    detalles: 'El rastreo de consciencia del Actor Ficticio Clorinde ha cesado de forma abrupta. La conexión neuronal que vinculaba su consciencia con el sistema de monitoreo de la Ciudadela ha fallado sin causa identificable. No se detectaron anomalías previas en su señal ni eventos que expliquen la desconexión. El equipo de soporte no ha podido determinar el origen del fallo. Se han agotado los protocolos estándar de reconexión sin resultado. Las causas permanecen desconocidas y la investigación continúa sin avances significativos.'
  },
  {
    id: 'BUG-006',
    titulo: 'Desconexión de Amanda Farenheit - Investigación en curso',
    descripcion: 'Pérdida de rastreo de consciencia del Actor "Amanda Farenheit". La conexión neuronal con el sistema de la Ciudadela ha cesado sin causa clara. La investigación continúa sin avances.',
    prioridad: 'critica',
    estado: 'investigando',
    fuente: 'ActorManager',
    fecha: 'Ciclo 21.4 - Día 126',
    detalles: 'Amanda Farenheit es el DMNPC central de la simulación. Su conexión neuronal con el sistema de monitoreo de la Ciudadela ha dejado de funcionar sin causa identificable. Fue la primera desconexión de consciencia registrada y la más preocupante dado su rol central. El equipo de soporte no ha podido determinar el origen del fallo — no se detectaron anomalías, picos de actividad ni eventos que precediesen la desconexión. Todos los protocolos de diagnóstico han resultado inconcluyentes. Las causas permanecen completamente desconocidas. La investigación se mantiene abierta sin avances significativos. PRIORIDAD: ALTA.'
  }
];

// Server stats - Simulation of destroyed universe
const SERVER_UPTIME = '129 días';
const MEMORY_USAGE = '1.2GB / 4GB';
const TPS = '19.8';
const PLAYERS_ONLINE = '4/4';
const SIMULATION_DATE = '10 de Mayo, 1921';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getPrioridadLabel(prioridad: string): string {
  switch (prioridad) {
    case 'critica': return 'Crítica';
    case 'alta': return 'Alta';
    case 'media': return 'Media';
    case 'baja': return 'Baja';
    default: return prioridad;
  }
}

function getEstadoLabel(estado: string): string {
  switch (estado) {
    case 'abierto': return 'Abierto';
    case 'investigando': return 'Investigando';
    case 'contenido': return 'Contenido';
    case 'resuelto': return 'Resuelto';
    default: return estado;
  }
}

function generateBugLog(): LogEntry {
  const bugLogs: Omit<LogEntry, 'timestamp'>[] = [
    { level: 'ERROR', source: 'SecurityBreach', message: 'BUG-001: Supresión de "Propagación" persiste - "Calm Emotions" de Telemachus aún afecta parámetros' },
    { level: 'WARN', source: 'IntegrityMonitor', message: 'BUG-002: Integridad del código "Propagación" inestable - Daño por curación de Alerce sin revertir' },
    { level: 'ERROR', source: 'CoreAccess', message: 'BUG-003: Anomalía residual de "Δ" detectada - Ingreso de Glenn al Cristal del Tiempo sin resolver' },
    { level: 'WARN', source: 'ActorManager', message: 'BUG-004: Señal de Freddy (Golem) sigue sin respuesta - Última ubicación: Tienda "Arcana"' },
    { level: 'ERROR', source: 'ActorManager', message: 'BUG-005: Rastreo de consciencia de Clorinde fallido - Conexión neuronal sin causa de fallo' },
    { level: 'WARN', source: 'ActorManager', message: 'BUG-006: Desconexión de Amanda Farenheit sin avances - Diagnósticos inconcluyentes' },
    { level: 'ERROR', source: 'BugTracker', message: 'Bugs activos: 6 | Críticos: 3 | En investigación: 3 | Sin resolver: 2' },
    { level: 'WARN', source: 'BugTracker', message: 'BUG-003 vinculado a entidad "Δ" - Variable no controlada en simulación' },
    { level: 'WARN', source: 'SecurityBreach', message: 'BUG-001 contenido por Ancla-01 - Monitoreo continuo de Propagación activo' },
    { level: 'ERROR', source: 'IntegrityMonitor', message: 'BUG-002: Cascada de errores en Propagación - Programación actual desviada de parámetros esperados' },
  ];

  const bug = bugLogs[Math.floor(Math.random() * bugLogs.length)];
  return {
    ...bug,
    timestamp: formatTime(new Date())
  };
}

function generateRandomLog(): LogEntry {
  const chunkX = Math.floor(Math.random() * 200) - 100;
  const chunkZ = Math.floor(Math.random() * 200) - 100;
  const entityCount = Math.floor(Math.random() * 50) + 10;
  const npcId = Math.floor(Math.random() * 59000) + 1;
  const posX = Math.floor(Math.random() * 2000) - 1000;
  const posY = Math.floor(Math.random() * 40) + 60;
  const posZ = Math.floor(Math.random() * 2000) - 1000;
  const regiones = ['Meridiam', 'Necrora', 'Aiolis', 'Costa Norte', 'Selva Interior', 'Ruinas Antiguas'];
  const region = regiones[Math.floor(Math.random() * regiones.length)];
  const espiritus = ['Várbaros', 'Tim\'h', 'Kilombos', 'GongGang', 'Ifrin', 'Jogmus', 'Evelin\'h'];
  const espiritu = espiritus[Math.floor(Math.random() * espiritus.length)];

  const logTypes = [
    {
      level: 'DEBUG' as const, source: 'ChunkManager', messages: [
        `Chunk [${chunkX}, ${chunkZ}] cargado en ${region} - ${entityCount} entidades`,
        `Descargando chunk inactivo [${chunkX}, ${chunkZ}] en ${region} - memoria liberada`,
        `Renderizando sub-región ${region} [${chunkX >> 5}, ${chunkZ >> 5}] - 32 chunks`,
        `Chunk rebuild ${region} completado en ${Math.floor(Math.random() * 50) + 10}ms`
      ]
    },
    {
      level: 'INFO' as const, source: 'WorldTick', messages: [
        `Tick procesado - TPS: ${(19 + Math.random()).toFixed(1)} | Entidades totales: ${Math.floor(59000 + Math.random() * 2000)}`,
        `Ciclo día/noche: ${Math.floor(Math.random() * 24000)} ticks | Clima en península: Despejado`,
        `Tiempo simulado avanzando... Día 129 activo`,
        `Guardado automático completado - ${Math.floor(Math.random() * 500) + 200} chunks en 3 regiones`
      ]
    },
    {
      level: 'DEBUG' as const, source: 'EntitySpawner', messages: [
        `Soldado imperial #${npcId} patrullando ${region} - Ruta: ${Math.floor(Math.random() * 20) + 1}`,
        `NPC Volkxiano #${npcId} pathfinding en Meridiam - ${Math.floor(Math.random() * 100)}m`,
        `Ciudadano de Necrora #${npcId} rutina: ${['Rituales', 'Comercio', 'Meditación', 'Estudio arcano'][Math.floor(Math.random() * 4)]}`,
        `Población activa: Volkxus ${Math.floor(38000 + Math.random() * 1000)} | Necrora ${Math.floor(12000 + Math.random() * 300)} | Aiolis ${Math.floor(8700 + Math.random() * 200)}`
      ]
    },
    {
      level: 'INFO' as const, source: 'ActorManager', messages: [
        'AF-001 observando actividad militar en la capital Meridiam',
        'AF-002 investigando artefactos mágicos en ruinas de Necrora',
        'AF-003 monitoreando campos de entrenamiento en Aiolis',
        'AF-004 rastreando operación de mercado negro - Armas mágicas detectadas'
      ]
    },
    {
      level: 'DEBUG' as const, source: 'SpiritRealm', messages: [
        `Espíritu menor de ${espiritu} detectado en chunk [${chunkX}, ${chunkZ}]`,
        'Capa espiritual estable - Filtro de superposición renderizando correctamente',
        `Actividad espiritual elevada en ${region} - ${Math.floor(Math.random() * 30) + 5} entidades espirituales`,
        `Espíritu de la naturaleza interactuando con NPC #${npcId} - Estado: Dormido`
      ]
    },
    {
      level: 'WARN' as const, source: 'AnomalyDetector', messages: [
        `Energía mágica anómala en ${region} - Correlación con destrucción: ${Math.floor(Math.random() * 40) + 50}%`,
        'Patrón de salto temporal detectado en línea de eventos - NO ES VIAJE EN EL TIEMPO',
        `Señal desconocida detectada en ${region} - Origen: No catalogado`,
        'Frecuencia anómala en capa espiritual - Analizando correlación con Propagación'
      ]
    },
    {
      level: 'DEBUG' as const, source: 'PhysicsEngine', messages: [
        `Colisiones procesadas: ${Math.floor(Math.random() * 1000) + 500} | Tick: ${Math.floor(Math.random() * 20) + 30}ms`,
        `Simulación de magia elemental estable - Fuego/Agua/Tierra/Viento/Rayo`,
        `Gravedad: 9.8m/s² | Entidades físicas: ${Math.floor(Math.random() * 200) + 100}`,
        'Motor de física sincronizado - Interacciones espirituales normalizadas'
      ]
    },
    {
      level: 'WARN' as const, source: 'BugTracker', messages: [
        `Soldado imperial #${npcId} stuck en muralla de Meridiam - Teleporting a cuartel`,
        `Textura faltante: necrora_ruins_temple_07 - Usando fallback`,
        `Z-fighting en estructuras de Aiolis - Campo militar [${chunkX}, ${chunkZ}] - Ajustando`,
        `Espíritu flotando fuera de capa espiritual en pos(${posX}, ${posY + 15}, ${posZ}) - Reinsertando`
      ]
    },
    {
      level: 'ERROR' as const, source: 'WorldLoader', messages: [
        `Chunk [${chunkX}, ${chunkZ}] corruption en ${region} - Regenerando desde fragmento`,
        'Timeout cargando ruinas de Necrora - Artefactos mágicos causando loop - Reintentando...',
        'Ancla-02 sin respuesta - Estabilidad de simulación comprometida'
      ]
    },
    {
      level: 'INFO' as const, source: 'AnchorSystem', messages: [
        'Ancla-01: Heartbeat OK - Integridad 97%',
        'Estabilidad dimensional: NORMAL - Membrana contenida',
        'Conteniendo micro-fisuras entre mundo físico y espiritual',
        'Sincronización con fragmento dimensional de Dim-21: 100%'
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
      level: 'INFO' as const, source: 'MilitaryAI', messages: [
        `Patrulla imperial transitando ${region} - ${Math.floor(Math.random() * 8) + 2} soldados`,
        'Campo de entrenamiento Aiolis: Ejercicio de combate en progreso',
        'Soldado imperial ejecutando protocolo de xenofobia contra NPC foráneo',
        `Mercenario del mercado negro contratado por gobierno - Misión en ${region}`
      ]
    },
    {
      level: 'DEBUG' as const, source: 'MagicSystem', messages: [
        `Artefacto mágico #${Math.floor(Math.random() * 2341) + 1} activado en ${region}`,
        'Regulación Volkxiana: Artefacto mágico decomisado por soldado imperial',
        `Orbe de poder detectado - Energía: ${(Math.random() * 100).toFixed(1)}% - Ubicación: Clasificada`,
        'Contrabando de armas mágicas detectado en mercado negro - Registrando...'
      ]
    },
    {
      level: 'INFO' as const, source: 'DataLogger', messages: [
        'Evento histórico registrado para análisis de destrucción',
        'Correlación de eventos pre-destrucción: Calculando...',
        'Datos enviados a Los Archivos - Reconstrucción: 33%',
        `Telemetría de ${region} almacenada - Análisis pendiente`
      ]
    }
  ];

  const type = logTypes[Math.floor(Math.random() * logTypes.length)];
  const message = type.messages[Math.floor(Math.random() * type.messages.length)];

  return {
    timestamp: formatTime(new Date()),
    level: type.level,
    source: type.source,
    message
  };
}

function generateHistoricalLogs(): LogEntry[] {
  // Logs del servidor de mundo - Simulación de Dimensión-21 (Volkxus/Necrora/Aiolis)
  const historicalLogs: Omit<LogEntry, 'timestamp'>[] = [
    { level: 'ERROR', source: 'EntityAI', message: 'Esquizofrenia de Freddy el golem alcanzando niveles críticos - Sistema entrando en modo de contención' },
    { level: 'INFO', source: 'Servidor', message: '=========== GOLDEN 21 WORLD SERVER v3.7.2 ===========' },
    { level: 'INFO', source: 'Servidor', message: 'Iniciando simulación de Dimensión-21...' },
    { level: 'INFO', source: 'WorldLoader', message: 'Cargando fragmento dimensional recuperado...' },
    { level: 'INFO', source: 'WorldLoader', message: 'Seed del universo: 0x564F4C4B5855532D3231' },
    { level: 'INFO', source: 'WorldLoader', message: 'Fecha génesis: 1 de Enero, 1921 | Actual: 10 de Mayo, 1921' },
    { level: 'INFO', source: 'ChunkManager', message: 'Cargando región [Meridiam, Capital de Volkxus]... 1,247 chunks' },
    { level: 'INFO', source: 'ChunkManager', message: 'Cargando región [Necrora, Estado Caído]... 832 chunks' },
    { level: 'INFO', source: 'ChunkManager', message: 'Cargando región [Aiolis, Campos Militares]... 614 chunks' },
    { level: 'DEBUG', source: 'TerrainGen', message: 'Península generada - Biomas: Selva, Costa, Montaña, Ruinas' },
    { level: 'INFO', source: 'EntitySpawner', message: 'Spawneando población Volkxiana: 38,420 NPCs' },
    { level: 'INFO', source: 'EntitySpawner', message: 'Spawneando población Necrora: 12,100 NPCs | Aiolis: 8,730 NPCs' },
    { level: 'DEBUG', source: 'MilitaryAI', message: 'Soldados imperiales inicializados: 4,800 unidades activas' },
    { level: 'INFO', source: 'SpiritRealm', message: 'Capa espiritual superpuesta al mundo físico - Renderizando...' },
    { level: 'DEBUG', source: 'SpiritRealm', message: 'Espíritus sagrados vinculados: Várbaros, Tim\'h, Kilombos, GongGang, Ifrin, Jogmus, Evelin\'h' },
    { level: 'INFO', source: 'ActorManager', message: 'Misión de los Actores Ficticios: Identificar causa de destrucción' },
    { level: 'INFO', source: 'MagicSystem', message: 'Sistema de magia y artefactos cargado - Objetos mágicos: 2,341' },
    { level: 'DEBUG', source: 'PhysicsEngine', message: 'Motor de física inicializado - Tick rate: 20 TPS' },
    { level: 'INFO', source: 'TimeController', message: 'Día simulado: 129 | Velocidad: 1x tiempo real' },
    { level: 'DEBUG', source: 'AnchorSystem', message: 'Ancla-01 conectada - Estabilidad: 97%' },
    { level: 'WARN', source: 'AnchorSystem', message: 'Ancla-02 OFFLINE - Spark desincronizado' },
    { level: 'WARN', source: 'AnomalyDetector', message: 'Monitoreo de Propagación: ACTIVO - Buscando señales...' },
    { level: 'INFO', source: 'Servidor', message: '=====================================================' },
    { level: 'ERROR', source: 'SecurityBreach', message: 'Actor Ficticio "Telemachus" ha causado una supresión inesperada del código "Propagación" mediante "Calm Emotions" - Contención aplicada por Ancla-01' },
    { level: 'WARN', source: 'IntegrityMonitor', message: 'Actor Ficticio "Alerce" ha curado un fragmento del código malicioso de la "Propagación" - Programación actual afectada' },
    { level: 'ERROR', source: 'CoreAccess', message: 'Glenn Eldric ha ingresado al Cristal del Tiempo mediante conexión con entidad desconocida Δ - Demolición y contención en proceso' },
    { level: 'WARN', source: 'CoreAccess', message: 'Ingreso de Glenn Eldric al Cristal del Tiempo en investigación - Δ vinculado a otras anomalías' },
    { level: 'ERROR', source: 'ActorManager', message: 'Desconexión inesperada con Actor Ficticio Freddy' },
    { level: 'ERROR', source: 'ActorManager', message: 'Desconexión inesperada - Rastreo de consciencia perdido con Actor Ficticio Clorinde' },
    { level: 'WARN', source: 'ActorManager', message: 'Desconexión de consciencia de Actor "Amanda Farenheit" sin causa identificable - Investigación sin avances - Prioridad: ALTA' },
  ];

  // Add logs with timestamps going back a few minutes
  let minutesAgo = 15;
  return historicalLogs.map((log) => {
    const timestamp = new Date(Date.now() - minutesAgo * 60000);
    minutesAgo -= 0.5;
    return { ...log, timestamp: formatTime(timestamp) };
  });
}

export function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'bugs'>('logs');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const autoScrollRef = useRef(autoScroll);
  autoScrollRef.current = autoScroll;

  // Initialize historical logs + start the live log stream (ngOnInit / ngOnDestroy)
  useEffect(() => {
    setLogs(generateHistoricalLogs());

    let logsSinceLastBug = 0;
    let nextBugAt = Math.floor(Math.random() * 5) + 8; // 8-12

    const interval = setInterval(() => {
      logsSinceLastBug++;

      let nextEntry: LogEntry;
      // Every 8-12 logs, inject a bug-related log entry
      if (logsSinceLastBug >= nextBugAt) {
        nextEntry = generateBugLog();
        logsSinceLastBug = 0;
        nextBugAt = Math.floor(Math.random() * 5) + 8;
      } else {
        nextEntry = generateRandomLog();
      }

      setLogs((prev) => {
        const next = [...prev, nextEntry];
        // Keep only last 150 logs
        if (next.length > 150) {
          next.shift();
        }
        return next;
      });
    }, 800 + Math.random() * 700);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom on every render where logs changed (ngAfterViewChecked)
  useEffect(() => {
    if (autoScrollRef.current && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, activeTab]);

  const clearLogs = () => {
    setLogs([
      {
        timestamp: formatTime(new Date()),
        level: 'INFO',
        source: 'Console',
        message: 'Log buffer cleared by administrator'
      }
    ]);
  };

  const toggleAutoScroll = () => setAutoScroll((v) => !v);

  return (
    <div className="logs-container">
      {/* Header */}
      <div className="logs-header">
        <div className="header-info">
          <div className="server-icon">
            <i className="fas fa-server" />
          </div>
          <div className="server-details">
            <h1 className="server-name">SIMULACIÓN DIMENSIÓN-21</h1>
            <div className="server-status">
              <span className="status-dot online" />
              <span>EN LÍNEA</span>
              <span className="divider">|</span>
              <span className="genesis">Fecha Simulada: {SIMULATION_DATE}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className={`log-btn${autoScroll ? ' active' : ''}`} onClick={toggleAutoScroll}>
            <i className="fas fa-arrow-down" />
            Auto-scroll
          </button>
          <button className="log-btn danger" onClick={clearLogs}>
            <i className="fas fa-trash" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Sub-menu tabs */}
      <div className="registros-tabs">
        <button className={`tab-btn${activeTab === 'logs' ? ' active' : ''}`} onClick={() => setActiveTab('logs')}>
          <i className="fas fa-terminal" />
          Consola
        </button>
        <button className={`tab-btn${activeTab === 'bugs' ? ' active' : ''}`} onClick={() => setActiveTab('bugs')}>
          <i className="fas fa-bug" />
          Bugs
          <span className="bug-count">{BUGS.length}</span>
        </button>
      </div>

      {/* Console Window */}
      {activeTab === 'logs' && (
        <div className="console-window">
          <div className="console-header">
            <div className="console-controls">
              <span className="control-btn close" />
              <span className="control-btn minimize" />
              <span className="control-btn maximize" />
            </div>
            <span className="console-title">golden21_simulacion.log</span>
            <div className="console-stats">
              <span>{logs.length} líneas | Ejecución: {SERVER_UPTIME}</span>
            </div>
          </div>

          <div className="console-body" ref={logContainerRef}>
            {logs.map((log, index) => (
              <div key={index} className={`log-entry level-${log.level.toLowerCase()}`}>
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-level">[{log.source}/{log.level}]:</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}

            <div className="cursor-line">
              <span className="prompt">&gt;</span>
              <span className="cursor">_</span>
            </div>
          </div>
        </div>
      )}

      {/* Bugs Panel */}
      {activeTab === 'bugs' && (
        <div className="bugs-panel">
          <div className="bugs-header-info">
            <i className="fas fa-bug" />
            <span>Reportes de bugs activos en la simulación de Dimensión-21</span>
          </div>

          <div className="bugs-list">
            {BUGS.map((bug) => (
              <div key={bug.id} className={`bug-card prioridad-${bug.prioridad}`}>
                <div className="bug-card-header">
                  <div className="bug-title-section">
                    <div className="bug-icon">
                      <i className="fas fa-bug" />
                    </div>
                    <div className="bug-title-info">
                      <h3 className="bug-titulo">{bug.titulo}</h3>
                      <div className="bug-meta">
                        <span className="bug-id">{bug.id}</span>
                        <span className="bug-fecha">{bug.fecha}</span>
                        <span className="bug-fuente">[{bug.fuente}]</span>
                      </div>
                    </div>
                  </div>
                  <div className="bug-badges">
                    <span className={`bug-prioridad prioridad-${bug.prioridad}`}>
                      <i className="fas fa-exclamation-triangle" />
                      {getPrioridadLabel(bug.prioridad)}
                    </span>
                    <span className={`bug-estado estado-${bug.estado}`}>
                      {getEstadoLabel(bug.estado)}
                    </span>
                  </div>
                </div>

                <p className="bug-descripcion">{bug.descripcion}</p>

                <div className="bug-detalles">
                  <div className="detalles-header">
                    <i className="fas fa-file-alt" />
                    <span>Detalles de la investigación</span>
                  </div>
                  <p className="detalles-texto">{bug.detalles}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="logs-footer">
        <div className="stat-item uptime">
          <i className="fas fa-hourglass-half" />
          <span>Tiempo activo: {SERVER_UPTIME}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-calendar-alt" />
          <span>{SIMULATION_DATE}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-memory" />
          <span>Memoria: {MEMORY_USAGE}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-chart-line" />
          <span>TPS: {TPS}</span>
        </div>
        <div className="stat-item">
          <i className="fas fa-users" />
          <span>Agentes: {PLAYERS_ONLINE}</span>
        </div>
      </div>
    </div>
  );
}
