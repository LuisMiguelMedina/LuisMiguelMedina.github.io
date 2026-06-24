import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import './Misiones.scss';

type TipoMision = 'reconocimiento' | 'extraccion' | 'contencion' | 'investigacion' | 'rescate';
type EstadoMision = 'activa' | 'completada' | 'pendiente' | 'cancelada';
type PrioridadMision = 'critica' | 'alta' | 'media' | 'baja';
type ClasificacionMision = 'confidencial' | 'secreto' | 'alto-secreto';
type FiltroEstado = 'todas' | 'activa' | 'completada' | 'pendiente';

interface Mision {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoMision;
  estado: EstadoMision;
  prioridad: PrioridadMision;
  dimension: string;
  fechaInicio: string;
  lider: string;
  equipoSize: number;
  objetivos: string[];
  progreso: number;
  clasificacion: ClasificacionMision;
}

const MISIONES: Mision[] = [
  {
    id: 'MSN-001',
    codigo: 'GOLDEN-21-PHASE2',
    nombre: 'Proyecto Golden 21: Reconstrucción Fragmento Epsilon',
    tipo: 'contencion',
    estado: 'activa',
    prioridad: 'critica',
    dimension: 'Dimensión 21',
    fechaInicio: '2026-02-01',
    lider: 'Katherine M.2',
    equipoSize: 5,
    objetivos: [
      'Estabilizar fragmento dimensional con anclas de realidad',
      'Sincronizar resonancia del Spark con el núcleo del fragmento',
      'Reconstruir tejido dimensional al 85% de integridad',
    ],
    progreso: 33,
    clasificacion: 'alto-secreto',
  },
  {
    id: 'MSN-002',
    codigo: 'LEGION-INTERCEPT-7',
    nombre: 'Intercepción Avanzada Legión Antimateria',
    tipo: 'reconocimiento',
    estado: 'activa',
    prioridad: 'critica',
    dimension: 'Sector Gamma-7',
    fechaInicio: '2026-02-08',
    lider: 'Hugh Everett',
    equipoSize: 4,
    objetivos: [
      'Rastrear firma energética de la Legión Antimateria',
      'Identificar posible presencia de Señores de las Cenizas',
      'Establecer perímetro de alerta temprana',
      'Documentar tácticas de infiltración del enemigo',
    ],
    progreso: 32,
    clasificacion: 'alto-secreto',
  },
  {
    id: 'MSN-003',
    codigo: 'STELLARON-CONTAIN-4',
    nombre: 'Contención de Stellaron Detectado',
    tipo: 'contencion',
    estado: 'activa',
    prioridad: 'alta',
    dimension: 'Dimensión Fronteriza 2-3',
    fechaInicio: '2026-02-12',
    lider: 'Emmy Noether',
    equipoSize: 6,
    objetivos: [
      'Neutralizar efectos de corrupción del Stellaron',
      'Evitar propagación a dimensiones adyacentes',
      'Capturar para análisis en División de Cosmología Aplicada',
    ],
    progreso: 45,
    clasificacion: 'alto-secreto',
  },
  {
    id: 'MSN-004',
    codigo: 'NOUS-ARCHIVE-SYNC',
    nombre: 'Sincronización con el Archivo de Nous',
    tipo: 'investigacion',
    estado: 'activa',
    prioridad: 'alta',
    dimension: 'Plano de Erudición',
    fechaInicio: '2026-02-05',
    lider: 'Dr. Richard Feynman',
    equipoSize: 2,
    objetivos: [
      'Establecer conexión con el Aeon de la Erudición',
      'Descargar actualizaciones del conocimiento cósmico',
      'Integrar data con sistemas de Los Archivos',
    ],
    progreso: 78,
    clasificacion: 'secreto',
  },
  {
    id: 'MSN-005',
    codigo: 'ANOMALO-STABILIZE-2',
    nombre: 'Estabilización de Anomalo en Crisis',
    tipo: 'rescate',
    estado: 'completada',
    prioridad: 'critica',
    dimension: 'Ciudadela Zarek - Sector Médico',
    fechaInicio: '2026-01-28',
    lider: 'Werner Heisenberg',
    equipoSize: 3,
    objetivos: [
      'Contener manifestación inestable del Spark',
      'Aplicar protocolo de regulación arcana',
      'Transporte seguro a cámara de estabilización',
    ],
    progreso: 100,
    clasificacion: 'confidencial',
  },
  {
    id: 'MSN-006',
    codigo: 'TRANSIT-NEXUS-MAINT',
    nombre: 'Mantenimiento Nexo Central de Tránsito',
    tipo: 'contencion',
    estado: 'completada',
    prioridad: 'alta',
    dimension: 'Ciudadela Zarek - Nexo Central',
    fechaInicio: '2026-02-01',
    lider: 'Michio Kaku',
    equipoSize: 8,
    objetivos: [
      'Recalibrar portales hacia dimensiones 1-5',
      'Reforzar barreras contra infiltración dimensional',
      'Actualizar protocolos de autenticación de viajeros',
    ],
    progreso: 100,
    clasificacion: 'secreto',
  },
  {
    id: 'MSN-007',
    codigo: 'SPARK-CALIBRATION-Q1',
    nombre: 'Calibración Trimestral del Spark',
    tipo: 'investigacion',
    estado: 'pendiente',
    prioridad: 'media',
    dimension: 'Ciudadela Zarek - Cámara Arcana',
    fechaInicio: '2026-03-01',
    lider: 'Los Maquinistas Everett',
    equipoSize: 12,
    objetivos: [
      'Evaluar niveles de maná azul en todos los Ultras',
      'Detectar fluctuaciones anómalas del Spark',
      'Actualizar registro de capacidades arcanas',
    ],
    progreso: 0,
    clasificacion: 'confidencial',
  },
];

function getTipoIcon(tipo: TipoMision): string {
  switch (tipo) {
    case 'reconocimiento':
      return 'fas fa-binoculars';
    case 'extraccion':
      return 'fas fa-box';
    case 'contencion':
      return 'fas fa-shield-alt';
    case 'investigacion':
      return 'fas fa-flask';
    case 'rescate':
      return 'fas fa-life-ring';
    default:
      return 'fas fa-crosshairs';
  }
}

function getTipoLabel(tipo: TipoMision): string {
  switch (tipo) {
    case 'reconocimiento':
      return 'Reconocimiento';
    case 'extraccion':
      return 'Extracción';
    case 'contencion':
      return 'Contención';
    case 'investigacion':
      return 'Investigación';
    case 'rescate':
      return 'Rescate';
    default:
      return tipo;
  }
}

function getClasificacionLabel(clasificacion: ClasificacionMision): string {
  switch (clasificacion) {
    case 'confidencial':
      return 'CONFIDENCIAL';
    case 'secreto':
      return 'SECRETO';
    case 'alto-secreto':
      return 'ALTO SECRETO';
    default:
      return String(clasificacion).toUpperCase();
  }
}

function EstadoBadgeContent({ estado }: { estado: EstadoMision }): JSX.Element {
  switch (estado) {
    case 'activa':
      return (
        <>
          <i className="fas fa-play" /> EN CURSO
        </>
      );
    case 'completada':
      return (
        <>
          <i className="fas fa-check" /> COMPLETADA
        </>
      );
    case 'pendiente':
      return (
        <>
          <i className="fas fa-clock" /> PENDIENTE
        </>
      );
    case 'cancelada':
      return (
        <>
          <i className="fas fa-times" /> CANCELADA
        </>
      );
    default:
      return <></>;
  }
}

export function Misiones(): JSX.Element {
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todas');

  const misionesFiltradas = useMemo<Mision[]>(() => {
    if (filtroEstado === 'todas') {
      return MISIONES;
    }
    return MISIONES.filter((m) => m.estado === filtroEstado);
  }, [filtroEstado]);

  const misionesActivas = useMemo(() => MISIONES.filter((m) => m.estado === 'activa').length, []);
  const misionesCompletadas = useMemo(
    () => MISIONES.filter((m) => m.estado === 'completada').length,
    [],
  );
  const misionesPendientes = useMemo(
    () => MISIONES.filter((m) => m.estado === 'pendiente').length,
    [],
  );

  return (
    <div className="misiones-container">
      {/* Header */}
      <div className="misiones-header">
        <div className="header-info">
          <div className="header-icon">
            <i className="fas fa-crosshairs" />
          </div>
          <div className="header-text">
            <h1>Centro de Operaciones</h1>
            <p className="header-subtitle">Misiones Activas — Proyecto Golden 21</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge activa">
            <span className="stat-value">{misionesActivas}</span>
            <span className="stat-label">Activas</span>
          </div>
          <div className="stat-badge pendiente">
            <span className="stat-value">{misionesPendientes}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat-badge completada">
            <span className="stat-value">{misionesCompletadas}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-bar">
        <button
          className={`filtro-btn${filtroEstado === 'todas' ? ' active' : ''}`}
          onClick={() => setFiltroEstado('todas')}
        >
          <i className="fas fa-list" />
          Todas
        </button>
        <button
          className={`filtro-btn activa${filtroEstado === 'activa' ? ' active' : ''}`}
          onClick={() => setFiltroEstado('activa')}
        >
          <i className="fas fa-play-circle" />
          Activas
        </button>
        <button
          className={`filtro-btn pendiente${filtroEstado === 'pendiente' ? ' active' : ''}`}
          onClick={() => setFiltroEstado('pendiente')}
        >
          <i className="fas fa-clock" />
          Pendientes
        </button>
        <button
          className={`filtro-btn completada${filtroEstado === 'completada' ? ' active' : ''}`}
          onClick={() => setFiltroEstado('completada')}
        >
          <i className="fas fa-check-circle" />
          Completadas
        </button>
      </div>

      {/* Lista de Misiones */}
      <div className="misiones-list">
        {misionesFiltradas.map((mision) => (
          <div
            key={mision.id}
            className={`mision-card estado-${mision.estado} prioridad-${mision.prioridad}`}
          >
            <div className="mision-header">
              <div className="mision-tipo">
                <i className={getTipoIcon(mision.tipo)} />
                <span>{getTipoLabel(mision.tipo)}</span>
              </div>
              <div className="mision-badges">
                <span className={`clasificacion-badge ${mision.clasificacion}`}>
                  <i className="fas fa-lock" />
                  {getClasificacionLabel(mision.clasificacion)}
                </span>
                <span className={`prioridad-badge ${mision.prioridad}`}>
                  {mision.prioridad.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mision-body">
              <div className="mision-info">
                <span className="mision-codigo">{mision.codigo}</span>
                <h3 className="mision-nombre">{mision.nombre}</h3>

                <div className="mision-meta">
                  <div className="meta-item">
                    <i className="fas fa-globe" />
                    <span>{mision.dimension}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-user-shield" />
                    <span>{mision.lider}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-users" />
                    <span>{mision.equipoSize} agentes</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar" />
                    <span>{mision.fechaInicio}</span>
                  </div>
                </div>
              </div>

              <div className="mision-objetivos">
                <h4>Objetivos:</h4>
                <ul>
                  {mision.objetivos.map((objetivo, index) => (
                    <li key={index}>
                      {mision.estado === 'completada' ? (
                        <i className="fas fa-check" />
                      ) : (
                        <i className="fas fa-chevron-right" />
                      )}
                      {objetivo}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mision-footer">
              <div className="progreso-container">
                <div className="progreso-label">
                  <span>Progreso</span>
                  <span>{mision.progreso}%</span>
                </div>
                <div className="progreso-bar">
                  <div className="progreso-fill" style={{ width: `${mision.progreso}%` }} />
                </div>
              </div>
              <div className={`estado-badge ${mision.estado}`}>
                <EstadoBadgeContent estado={mision.estado} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="misiones-footer">
        <div className="footer-info">
          <i className="fas fa-exclamation-triangle" />
          <span>
            Acceso restringido a personal nivel 3 (Senior PM) o superior — Información clasificada
          </span>
        </div>
      </div>
    </div>
  );
}
