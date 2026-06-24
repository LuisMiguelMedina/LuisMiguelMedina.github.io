// Profile page for the Multiverse of Madness portal.
// Ported from the legacy Angular component
// (.legacy-angular/MoM-web/src/app/components/profile/profile.{ts,html,scss}).
// Consumes useAuth() (session/level) + ported helpers. Narrative data is
// generated client-side exactly as the legacy component did.
import { useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { levelName, levelColor } from '../permissions';
import { getStaffAvatar } from '../services/staffAvatar';
import type { AdminLevel } from '../types';
import './Profile.scss';

// Legacy KNOWN_UUIDS.KATHERINE_M2 — Katherine M.2 (Mark 2), Asistente del GPM Golden 21.
// The legacy value lived in permissions.service.ts (not ported to the React
// portal types), so it is reproduced here verbatim to keep the HR tab gating
// faithful.
const KATHERINE_M2_UUID = 'KTH-M2-0021';

// Fallback avatar (legacy onAvatarError data URI) for broken avatar images.
const FALLBACK_AVATAR_DATA_URI =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMzMzMiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjQwIiByPSIyMCIgZmlsbD0iIzY2NiIvPjxlbGxpcHNlIGN4PSI1MCIgY3k9Ijg1IiByeD0iMzAiIHJ5PSIyMCIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==';

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

type ProfileTab = 'overview' | 'info' | 'hr';

/** Stable, consistent hash for a string (legacy hashCode). */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** Localized time string for N minutes ago (legacy getTimeAgo). */
function getTimeAgo(minutes: number): string {
  const date = new Date(Date.now() - minutes * 60000);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function generateBio(level: AdminLevel, name: string, username: string): AdminBio {
  const bios: Record<number, AdminBio> = {
    4: {
      codename: `${username.toUpperCase()}`,
      origin: 'Nexus Prime - Comando Central',
      backstory: `${name} fue reclutado por el Consejo Dimensional después de demostrar habilidades excepcionales durante el Incidente Cuántico de 2019. Como Director, tiene acceso total a todas las dimensiones y puede modificar la estructura misma del multiverso. Su misión principal es mantener el equilibrio entre las realidades paralelas y prevenir colapsos dimensionales.`,
      specialty: 'Manipulación de Anclajes de Realidad y Protocolos de Emergencia Omega',
      quote: '"El caos es solo orden que aún no hemos comprendido."',
    },
    3: {
      codename: `${username.toUpperCase()}`,
      origin: 'Ciudadela Zarek - División de Archivos',
      backstory: `${name} obtuvo acceso al rango de Comandante tras demostrar aptitud excepcional en gestión de información clasificada. Con acceso a los archivos más delicados de la organización, supervisa la integridad documental y coordina las operaciones de inteligencia dimensional.`,
      specialty: 'Gestión de Archivos Clasificados y Análisis de Inteligencia',
      quote: '"La información es el arma más poderosa del multiverso."',
    },
    2: {
      codename: `${username.toUpperCase()}`,
      origin: 'División de Operaciones Especiales',
      backstory: `${name} ascendió al rango de Operador tras liderar exitosamente la Operación "QuantumLocked". Especializado en coordinación interdimensional, supervisa las operaciones diarias y gestiona los equipos de monitoreo. Su experiencia en navegación cuántica lo convierte en un activo invaluable para el programa.`,
      specialty: 'Coordinación de Equipos y Análisis Dimensional',
      quote: '"El deber es universal"',
    },
    1: {
      codename: `${username.toUpperCase()}`,
      origin: 'Academia de Observadores',
      backstory: `${name} es un observador en entrenamiento, recientemente asignado al programa DIMENSION-2. Su rol es monitorear las fluctuaciones dimensionales y reportar anomalías al equipo senior. Aunque su acceso es limitado, su potencial ha sido reconocido por los oficiales de alto rango.`,
      specialty: 'Monitoreo de Señales y Detección de Anomalías',
      quote: '"Observar es el primer paso para entender."',
    },
  };

  return bios[level] || bios[1];
}

function adminRoleFor(level: AdminLevel): string {
  switch (level) {
    case 4:
      return 'GPM';
    case 3:
      return 'SENIOR PM';
    case 2:
      return 'PM';
    case 1:
      return 'APM';
    default:
      return 'INDEFINIDO';
  }
}

export function Profile() {
  const { session, level } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const adminName = session?.name || 'Agente Desconocido';
  const adminUsername = session?.username || 'N/A';
  const adminRole = adminRoleFor(level);
  const adminAvatar = getStaffAvatar(session?.uuid);
  const isKTH01 = session?.uuid === KATHERINE_M2_UUID;

  const color = levelColor(level);
  const lvlName = levelName(level);

  // Narrative stats + bio + activity log (legacy generateNarrativeData, on init).
  const { stats, adminBio, activityLog } = useMemo(() => {
    const username = session?.username || 'admin';
    const name = session?.name || 'Unknown';
    const loginTime = session?.loginTime || new Date().toISOString();
    const hash = hashCode(username);

    const computedStats: AdminStats = {
      sessionsTotal: 100 + (hash % 500),
      lastAccess: new Date(loginTime).toLocaleString('es-ES'),
      clearanceCode: `CLR-${level}${hash.toString(16).toUpperCase().slice(0, 4)}`,
      assignedDimension: level >= 2 ? 'DIMENSION-1 & DIMENSION-2' : 'DIMENSION-1',
      missionStatus: 'MONITOREO ACTIVO',
    };

    const computedBio = generateBio(level, name, username);

    const computedLog: AdminLog[] = [
      { timestamp: getTimeAgo(0), action: 'Sesión iniciada', status: 'success' },
      { timestamp: getTimeAgo(5), action: 'Protocolos de seguridad verificados', status: 'success' },
      { timestamp: getTimeAgo(15), action: 'Datos dimensionales sincronizados', status: 'info' },
      { timestamp: getTimeAgo(30), action: 'Base de datos accedida', status: 'info' },
      { timestamp: getTimeAgo(120), action: 'Escaneo de anomalías completado', status: 'warning' },
      { timestamp: getTimeAgo(360), action: 'Respaldo del sistema iniciado', status: 'success' },
    ];

    return { stats: computedStats, adminBio: computedBio, activityLog: computedLog };
  }, [session?.username, session?.name, session?.loginTime, level]);

  function onAvatarError(event: React.SyntheticEvent<HTMLImageElement>): void {
    event.currentTarget.src = FALLBACK_AVATAR_DATA_URI;
  }

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="agent-avatar">
          <div className="avatar-ring" style={{ borderColor: color }}>
            <img
              className="avatar-img"
              src={adminAvatar}
              alt={adminName}
              loading="lazy"
              onError={onAvatarError}
            />
          </div>
          <div className="status-indicator online"></div>
        </div>

        <div className="agent-info">
          <h1 className="agent-name">{adminName}</h1>
          <div className="agent-code">@{adminUsername}</div>
          <div className="agent-role" style={{ color }}>
            <i className="fas fa-shield-alt"></i>
            {' '}
            {adminRole}
          </div>
        </div>

        <div className="level-badge" style={{ background: color }}>
          <span className="level-number">{level}</span>
          <span className="level-label">{lvlName}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-tachometer-alt"></i>
          Resumen
        </button>
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <i className="fas fa-id-card"></i>
          Información
        </button>
        {isKTH01 && (
          <button
            className={`tab-btn hr-tab ${activeTab === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveTab('hr')}
          >
            <i className="fas fa-file-alt"></i>
            Expediente
          </button>
        )}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="tab-content overview-tab">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-terminal"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.sessionsTotal}</span>
                <span className="stat-label">Sesiones Totales</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon clearance">
                <i className="fas fa-id-badge"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.clearanceCode}</span>
                <span className="stat-label">Código de Acceso</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon dimension">
                <i className="fas fa-globe"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value small">{stats.assignedDimension}</span>
                <span className="stat-label">Dimensiones Asignadas</span>
              </div>
            </div>
          </div>

          {/* Info Panels Row */}
          <div className="panels-row">
            {/* Mission Status Panel */}
            <div className="panel mission-panel">
              <div className="panel-header">
                <i className="fas fa-satellite-dish"></i>
                <span>ESTADO DE MISIÓN</span>
              </div>
              <div className="panel-body">
                <div className="mission-status">
                  <div className="status-dot pulse"></div>
                  <span>{stats.missionStatus}</span>
                </div>
                <div className="mission-detail">
                  <span className="detail-label">Último Acceso:</span>
                  <span className="detail-value">{stats.lastAccess}</span>
                </div>
                <div className="mission-detail">
                  <span className="detail-label">Conexión:</span>
                  <span className="detail-value success">SEGURA</span>
                </div>
                <div className="mission-detail">
                  <span className="detail-label">Encriptación:</span>
                  <span className="detail-value">AES-256</span>
                </div>
              </div>
            </div>

            {/* Activity Log Panel */}
            <div className="panel activity-panel">
              <div className="panel-header">
                <i className="fas fa-list-alt"></i>
                <span>REGISTRO DE ACTIVIDAD</span>
              </div>
              <div className="panel-body">
                <div className="activity-list">
                  {activityLog.map((log) => (
                    <div className={`activity-item ${log.status}`} key={log.timestamp}>
                      <span className="activity-time">{log.timestamp}</span>
                      <span className="activity-action">{log.action}</span>
                      <span className="activity-status">
                        {log.status === 'success' ? (
                          <i className="fas fa-check-circle"></i>
                        ) : log.status === 'warning' ? (
                          <i className="fas fa-exclamation-triangle"></i>
                        ) : (
                          <i className="fas fa-info-circle"></i>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INFO TAB */}
      {activeTab === 'info' && (
        <div className="tab-content info-tab">
          <div className="info-grid">
            {/* Codename Card */}
            <div className="info-card codename-card">
              <div className="info-icon">
                <i className="fas fa-fingerprint"></i>
              </div>
              <div className="info-label">NOMBRE CLAVE</div>
              <div className="info-value large">{adminBio.codename}</div>
            </div>

            {/* Origin Card */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-label">ORIGEN</div>
              <div className="info-value">{adminBio.origin}</div>
            </div>

            {/* Specialty Card */}
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="info-label">ESPECIALIDAD</div>
              <div className="info-value">{adminBio.specialty}</div>
            </div>
          </div>

          {/* Backstory Panel */}
          <div className="panel backstory-panel">
            <div className="panel-header">
              <i className="fas fa-book"></i>
              <span>EXPEDIENTE DEL AGENTE</span>
            </div>
            <div className="panel-body">
              <p className="backstory-text">{adminBio.backstory}</p>
              <div className="agent-quote">
                <i className="fas fa-quote-left"></i>
                {' '}
                {adminBio.quote}
                {' '}
                <i className="fas fa-quote-right"></i>
              </div>
            </div>
          </div>

          {/* Classification Badge */}
          <div className="classification-footer">
            <div
              className="classification-stamp"
              style={{ borderColor: color, color }}
            >
              <span>CLASIFICADO</span>
              <span className="level-text">REQUIERE NIVEL {level} DE ACCESO</span>
            </div>
          </div>
        </div>
      )}

      {/* HR FILE TAB (Only for KTH01) */}
      {activeTab === 'hr' && isKTH01 && (
        <div className="tab-content hr-file-tab">
          {/* Classification Header */}
          <div className="hr-classification-banner">
            <i className="fas fa-lock"></i>
            <span className="classification-text">
              CLASIFICACIÓN: Interno — Solo personal autorizado
            </span>
            <span className="update-cycle">Última actualización: Ciclo 21.7</span>
          </div>

          {/* General Data Section */}
          <div className="hr-section">
            <div className="hr-section-header">
              <i className="fas fa-user-circle"></i>
              <h2>Datos Generales</h2>
            </div>
            <div className="hr-data-table">
              <div className="hr-row">
                <span className="hr-label">Designación</span>
                <span className="hr-value highlight">Katherine M.2 (Mark 2)</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Puesto actual</span>
                <span className="hr-value">Asistente del GPM — Golden 21</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Departamento</span>
                <span className="hr-value">Operaciones Dimensionales / Ingeniería Táctica</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Base de operaciones</span>
                <span className="hr-value">Ciudadela Zarek</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Estatus</span>
                <span className="hr-value status-active">
                  <i className="fas fa-circle"></i> Activa
                </span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Tipo biológico</span>
                <span className="hr-value">Androide — Chasis militar sintético completo</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Variante</span>
                <span className="hr-value special">Zarek Ultra (Reconstrucción Sintética)</span>
              </div>
            </div>
          </div>

          {/* Professional History */}
          <div className="hr-section">
            <div className="hr-section-header">
              <i className="fas fa-briefcase"></i>
              <h2>Historial Profesional</h2>
            </div>
            <div className="hr-content-block">
              <p className="hr-paragraph">
                Katherine M.2 fue comisionada como sucesora operativa de{' '}
                <strong>Katherine Zarek</strong> (fallecida en acción). Su perfil combina
                experiencia táctica de nivel Elite con capacidades administrativas avanzadas.
              </p>
              <p className="hr-paragraph">
                Previo a su asignación como asistente del GPM en Golden 21, completó todas las
                evaluaciones de combate y aptitud estratégica requeridas, superando los benchmarks
                establecidos por su predecesora.
              </p>
              <div className="hr-competencies">
                <h4>Áreas de competencia:</h4>
                <ul>
                  <li>
                    <i className="fas fa-crosshairs"></i> Operaciones militares y comando táctico
                  </li>
                  <li>
                    <i className="fas fa-atom"></i> Estabilización dimensional
                  </li>
                  <li>
                    <i className="fas fa-cogs"></i> Ingeniería de combate
                  </li>
                  <li>
                    <i className="fas fa-tasks"></i> Gestión de proyectos de alta prioridad
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Assignment */}
          <div className="hr-section project-section">
            <div className="hr-section-header">
              <i className="fas fa-project-diagram"></i>
              <h2>Asignación Actual: Proyecto Golden 21</h2>
            </div>
            <div className="hr-content-block">
              <p className="hr-paragraph">
                Asiste directamente a <strong>Amanda Zarek (GPM)</strong> en la coordinación de la
                iniciativa de reconstrucción y estabilización de los fragmentos dimensionales
                derivados de los experimentos temporales en la Dimensión 21. Reporta directamente al
                GPM.
              </p>
              <div className="project-phase">
                <span className="phase-label">Estado del proyecto:</span>
                <span className="phase-badge">Fase 2 (Echo)</span>
              </div>
              <div className="classified-notice">
                <i className="fas fa-shield-alt"></i>
                <span>
                  Detalles clasificados disponibles bajo solicitud con autorización Nivel 4 o
                  superior.
                </span>
              </div>
            </div>
          </div>

          {/* Performance Evaluation */}
          <div className="hr-section">
            <div className="hr-section-header">
              <i className="fas fa-chart-line"></i>
              <h2>Evaluación de Desempeño</h2>
            </div>
            <div className="performance-grid">
              <div className="performance-item exceeds">
                <span className="perf-area">Cumplimiento de misión</span>
                <span className="perf-rating">Excede expectativas</span>
                <div className="perf-bar">
                  <div className="perf-fill" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="performance-item meets">
                <span className="perf-area">Liderazgo de equipo</span>
                <span className="perf-rating">Cumple expectativas</span>
                <div className="perf-bar">
                  <div className="perf-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="performance-item full">
                <span className="perf-area">Preparación de combate</span>
                <span className="perf-rating">Capacidad plena</span>
                <div className="perf-bar">
                  <div className="perf-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="performance-item exceeds">
                <span className="perf-area">Rendimiento administrativo</span>
                <span className="perf-rating">Excede proyecciones</span>
                <div className="perf-bar">
                  <div className="perf-fill" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Psychological Notes */}
          <div className="hr-section confidential-section">
            <div className="hr-section-header warning">
              <i className="fas fa-exclamation-triangle"></i>
              <h2>Notas de Seguimiento Psicológico</h2>
              <span className="confidential-badge">CONFIDENCIAL — Acceso restringido</span>
            </div>
            <div className="hr-content-block">
              <p className="hr-paragraph">
                La empleada presenta un perfil psicológico estable pero bajo monitoreo continuo. Se
                ha observado una tendencia hacia la introspección y un temperamento notablemente más
                reservado de lo esperado para personal con su historial operativo.
              </p>
              <p className="hr-paragraph">
                No se reporta degradación en su línea base emocional. No requiere intervención
                inmediata. Se recomienda mantener evaluaciones periódicas.
              </p>
              <div className="diagnosis-box">
                <span className="diagnosis-label">Diagnóstico general:</span>
                <span className="diagnosis-result">
                  Apta para servicio activo sin restricciones
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="hr-section">
            <div className="hr-section-header">
              <i className="fas fa-phone-alt"></i>
              <h2>Contacto de Emergencia</h2>
            </div>
            <div className="hr-data-table contact-table">
              <div className="hr-row">
                <span className="hr-label">Mantenimiento técnico</span>
                <span className="hr-value">
                  División de Ingeniería Sintética, Ciudadela Zarek
                </span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Soporte psicológico</span>
                <span className="hr-value">Unidad de Bienestar - Casos Especiales</span>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="hr-document-footer">
            <i className="fas fa-shield-alt"></i>
            <p>
              Este documento es propiedad de la Ciudadela Zarek. Su distribución fuera del sistema de
              intranet constituye una violación de los protocolos de seguridad interna.
            </p>
            <div className="file-status">
              Estado del archivo: <span className="status-badge">VIGENTE</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Quote */}
      <div className="profile-footer">
        <div className="footer-code">ZRK INTRANET // MÓDULO PERFIL v2.4.1</div>
      </div>
    </div>
  );
}
