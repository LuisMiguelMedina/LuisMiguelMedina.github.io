import { useMemo, useState } from 'react';
import { getStaffAvatar } from '../services/staffAvatar';
import './Directorio.scss';

interface Personal {
  id: string;
  uuid: string;
  nombre: string;
  puesto: string;
  departamento: string;
  nivel: 1 | 2 | 3 | 4;
  estado: 'activo' | 'en-mision' | 'licencia' | 'inactivo';
  ubicacion: string;
  especialidad: string;
  variante: 'Original' | 'Ultra' | 'Anomalo' | 'Everett';
  proyecto?: string;
}

const PERSONAL: Personal[] = [
  {
    id: 'ZRK-001',
    uuid: 'KTH-M2-0021',
    nombre: 'Katherine M.2',
    puesto: 'Supervisor de Operaciones',
    departamento: 'Operaciones Dimensionales',
    nivel: 2,
    estado: 'activo',
    ubicacion: 'Nexo Central - Sector Alfa',
    especialidad: 'Comando Táctico / Ingeniería de Combate',
    variante: 'Ultra',
    proyecto: 'Golden 21',
  },
  {
    id: 'ZRK-002',
    uuid: 'MQN-E1-0002',
    nombre: 'Hugh Everett',
    puesto: 'Maquinista Senior',
    departamento: 'Los Maquinistas',
    nivel: 4,
    estado: 'activo',
    ubicacion: 'Nexo Central - Sala de Gobierno',
    especialidad: 'Filosofía Fundacional / Administración',
    variante: 'Original',
  },
  {
    id: 'ZRK-003',
    uuid: 'NVA-S3-0089',
    nombre: 'Emmy Noether',
    puesto: 'Investigadora Cosmológica',
    departamento: 'División de Cosmología Aplicada',
    nivel: 3,
    estado: 'activo',
    ubicacion: 'El Observatorio',
    especialidad: 'Monitoreo Aeónico / Sendas',
    variante: 'Original',
  },
  {
    id: 'ZRK-004',
    uuid: 'VLX-U2-0156',
    nombre: 'Max Planck',
    puesto: 'Explorador Dimensional',
    departamento: 'Operaciones Dimensionales',
    nivel: 2,
    estado: 'en-mision',
    ubicacion: 'Dimensión ZRK-21 - Campo',
    especialidad: 'Reconocimiento / The Spark',
    variante: 'Ultra',
  },
  {
    id: 'ZRK-005',
    uuid: 'EVR-D7-0012',
    nombre: 'Kaluza Zarek (Dimensión Tau)',
    puesto: 'Consultor Estratégico Dimensional',
    departamento: 'Los Maquinistas',
    nivel: 3,
    estado: 'activo',
    ubicacion: 'Sala de Gobierno - Cámara de Consejo',
    especialidad: 'Filosofía Fundacional / Estrategia Multiversal',
    variante: 'Everett',
  },
  {
    id: 'ZRK-006',
    uuid: 'ARX-O3-0045',
    nombre: 'Paul Dirac',
    puesto: 'Archivista Senior',
    departamento: 'Los Archivos',
    nivel: 3,
    estado: 'activo',
    ubicacion: 'Los Archivos - Conocimiento Unificado',
    especialidad: 'Síntesis de Conocimiento Multiversal',
    variante: 'Original',
  },
  {
    id: 'ZRK-007',
    uuid: 'FLX-N2-0312',
    nombre: 'Werner Heisenberg',
    puesto: 'Especialista en Contención',
    departamento: 'Operaciones Dimensionales',
    nivel: 2,
    estado: 'en-mision',
    ubicacion: 'Frontera D1-D2 - Misión CONTAIN-BETA',
    especialidad: 'Barreras de Energía / Fisuras',
    variante: 'Anomalo',
  },
  {
    id: 'ZRK-008',
    uuid: 'GNS-S4-0008',
    nombre: 'Dr. Richard Feynman',
    puesto: 'Miembro de la Sociedad de Genios',
    departamento: 'Sociedad de Genios',
    nivel: 4,
    estado: 'activo',
    ubicacion: 'Nexo Central - Comunión con Nous',
    especialidad: 'Consulta con Nous / Erudición',
    variante: 'Original',
  },
  {
    id: 'ZRK-009',
    uuid: 'TRN-U2-0178',
    nombre: 'Michio Kaku',
    puesto: 'Piloto del Nexo Central',
    departamento: 'División de Tránsito',
    nivel: 2,
    estado: 'activo',
    ubicacion: 'Nexo Central - Centro de Portales',
    especialidad: 'Navegación Interdimensional',
    variante: 'Ultra',
  },
  {
    id: 'ZRK-010',
    uuid: 'SPK-A1-0401',
    nombre: 'Erwin Schrödinger',
    puesto: 'Analista de Anomalías',
    departamento: 'División de Cosmología Aplicada',
    nivel: 1,
    estado: 'activo',
    ubicacion: 'El Observatorio - Monitoreo',
    especialidad: 'Detección de Stellarons',
    variante: 'Anomalo',
  },
  {
    id: 'ZRK-011',
    uuid: 'JKL-A1-0777',
    nombre: 'Dr. Jeckyll',
    puesto: 'Asistente de Proyecto',
    departamento: 'Operaciones Dimensionales',
    nivel: 1,
    estado: 'activo',
    ubicacion: 'Nexo Central - Sector Alfa',
    especialidad: 'Análisis de Datos / Apoyo Táctico',
    variante: 'Ultra',
    proyecto: 'Golden 21',
  },
  {
    id: 'ZRK-012',
    uuid: 'AZK-G4-0003',
    nombre: 'Amanda Zarek',
    puesto: 'Gerente de Proyecto',
    departamento: 'Los Maquinistas',
    nivel: 4,
    estado: 'inactivo',
    ubicacion: 'Nexo Central - Sala de Gobierno',
    especialidad: 'Administración Multiversal / Dirección Estratégica',
    variante: 'Everett',
    proyecto: 'Golden 21',
  },
  {
    id: 'ZRK-013',
    uuid: 'MSM-S3-0142',
    nombre: 'Martin Seamus',
    puesto: 'Supervisor de Control Cronotemporal',
    departamento: 'Control Cronotemporal',
    nivel: 3,
    estado: 'activo',
    ubicacion: 'Nexo Central - División Temporal',
    especialidad: 'Paradojas Temporales / Líneas de Tiempo',
    variante: 'Original',
    proyecto: 'Golden 21',
  },
];

const DEPARTAMENTOS = [
  'todos',
  'Operaciones Dimensionales',
  'Los Maquinistas',
  'División de Cosmología Aplicada',
  'Ingeniería Sintética',
  'Los Archivos',
  'Sociedad de Genios',
  'División de Tránsito',
  'Control Cronotemporal',
];

const PROYECTOS = ['todos', 'Golden 21'];

function getNivelLabel(nivel: number): string {
  switch (nivel) {
    case 1:
      return 'APM';
    case 2:
      return 'PM';
    case 3:
      return 'Senior PM';
    case 4:
      return 'GPM';
    default:
      return 'N/A';
  }
}

function getNivelColor(nivel: number): string {
  switch (nivel) {
    case 1:
      return '#90EE90';
    case 2:
      return '#4A90D9';
    case 3:
      return '#9B59B6';
    case 4:
      return '#FFD700';
    default:
      return '#808080';
  }
}

function getEstadoLabel(estado: string): string {
  switch (estado) {
    case 'activo':
      return 'Activo';
    case 'en-mision':
      return 'En Misión';
    case 'licencia':
      return 'Licencia';
    case 'inactivo':
      return 'Inactivo';
    default:
      return estado;
  }
}

function getVarianteLabel(variante: string): string {
  switch (variante) {
    case 'Ultra':
      return 'Zarek Ultra';
    case 'Original':
      return 'Zarek Original';
    case 'Anomalo':
      return 'Zarek Anomalo';
    case 'Everett':
      return 'Zarek Everett';
    default:
      return variante;
  }
}

function onImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  event.currentTarget.src = '/favicon.ico';
}

export function Directorio() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todos');
  const [filtroNivel, setFiltroNivel] = useState('todos');
  const [filtroProyecto, setFiltroProyecto] = useState('todos');

  const personalFiltrado = useMemo(() => {
    return PERSONAL.filter((p) => {
      const coincideBusqueda =
        busqueda === '' ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.puesto.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.uuid.toLowerCase().includes(busqueda.toLowerCase());

      const coincideDepartamento =
        filtroDepartamento === 'todos' || p.departamento === filtroDepartamento;

      const coincideNivel =
        filtroNivel === 'todos' || p.nivel === parseInt(filtroNivel, 10);

      const coincideProyecto =
        filtroProyecto === 'todos' || p.proyecto === filtroProyecto;

      return (
        coincideBusqueda &&
        coincideDepartamento &&
        coincideNivel &&
        coincideProyecto
      );
    });
  }, [busqueda, filtroDepartamento, filtroNivel, filtroProyecto]);

  const totalActivos = useMemo(
    () => PERSONAL.filter((p) => p.estado === 'activo').length,
    [],
  );

  const totalEnMision = useMemo(
    () => PERSONAL.filter((p) => p.estado === 'en-mision').length,
    [],
  );

  return (
    <div className="directorio-container">
      {/* Header */}
      <div className="directorio-header">
        <div className="header-info">
          <div className="header-icon">
            <i className="fas fa-address-book" />
          </div>
          <div className="header-text">
            <h1>Directorio de Personal</h1>
            <p className="header-subtitle">Directorio General ZRK</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-value">{PERSONAL.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-badge activo">
            <span className="stat-value">{totalActivos}</span>
            <span className="stat-label">Activos</span>
          </div>
          <div className="stat-badge mision">
            <span className="stat-value">{totalEnMision}</span>
            <span className="stat-label">En Misión</span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="filtros-container">
        <div className="search-box">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Buscar por nombre, puesto o UUID..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
          >
            <option value="todos">Todos los departamentos</option>
            {DEPARTAMENTOS.slice(1).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
          >
            <option value="todos">Todos los niveles</option>
            <option value="1">Nivel 1 - APM</option>
            <option value="2">Nivel 2 - PM</option>
            <option value="3">Nivel 3 - Senior PM</option>
            <option value="4">Nivel 4 - GPM</option>
          </select>
          <select
            className="filter-select"
            value={filtroProyecto}
            onChange={(e) => setFiltroProyecto(e.target.value)}
          >
            <option value="todos">Todos los proyectos</option>
            {PROYECTOS.slice(1).map((proy) => (
              <option key={proy} value={proy}>
                {proy}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Personal */}
      <div className="personal-grid">
        {personalFiltrado.map((persona) => (
          <div
            key={persona.id}
            className={`persona-card estado-${persona.estado}`}
          >
            <div className="card-header">
              <div className="avatar-container">
                <img
                  src={getStaffAvatar(persona.id)}
                  alt={persona.nombre}
                  loading="lazy"
                  onError={onImageError}
                />
                <div className={`estado-indicator ${persona.estado}`} />
              </div>
              <div className="header-badges">
                {persona.proyecto === 'Golden 21' && (
                  <div className="proyecto-badge golden-21">
                    <i className="fas fa-star" />
                    <span>Golden 21</span>
                  </div>
                )}
                <div
                  className="nivel-badge"
                  style={{ background: getNivelColor(persona.nivel) }}
                >
                  {getNivelLabel(persona.nivel)}
                </div>
              </div>
            </div>

            <div className="card-body">
              <h3 className="persona-nombre">{persona.nombre}</h3>
              <p className="persona-puesto">{persona.puesto}</p>

              <div
                className={`variante-badge variante-${persona.variante.toLowerCase()}`}
              >
                <i className="fas fa-dna" />
                {getVarianteLabel(persona.variante)}
              </div>

              <div className="info-row">
                <i className="fas fa-building" />
                <span>{persona.departamento}</span>
              </div>

              <div className="info-row">
                <i className="fas fa-map-marker-alt" />
                <span>{persona.ubicacion}</span>
              </div>

              <div className="info-row">
                <i className="fas fa-star" />
                <span>{persona.especialidad}</span>
              </div>
            </div>

            <div className="card-footer">
              <span className="uuid-badge">
                <i className="fas fa-fingerprint" />
                {persona.uuid}
              </span>
              <span className={`estado-badge ${persona.estado}`}>
                {getEstadoLabel(persona.estado)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {personalFiltrado.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-user-slash" />
          <p>No se encontró personal con los criterios especificados</p>
        </div>
      )}

      {/* Footer */}
      <div className="directorio-footer">
        <div className="footer-info">
          <i className="fas fa-shield-alt" />
          <span>
            Información clasificada — Nivel 2 o superior requerido para acceso
            completo
          </span>
        </div>
      </div>
    </div>
  );
}
