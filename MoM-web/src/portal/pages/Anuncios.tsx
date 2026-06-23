import { useMemo, useState } from 'react';
import './Anuncios.scss';

type TipoAnuncio = 'info' | 'urgente' | 'mantenimiento' | 'operativo';
type Prioridad = 'alta' | 'media' | 'baja';
type Filtro = 'todos' | TipoAnuncio;

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  tipo: TipoAnuncio;
  autor: string;
  fecha: string;
  prioridad: Prioridad;
  leido: boolean;
}

const ANUNCIOS_INICIALES: Anuncio[] = [
  {
    id: 'ZRK-2026-0051',
    titulo: 'Detección de Firma Antimateria en Sector Gamma-7',
    contenido:
      'Los sensores del Observatorio han registrado fluctuaciones de antimateria consistentes con actividad de la Legión Antimateria en las proximidades del Sector Gamma-7. Se recomienda a todo el personal en misión evitar tránsito por esa región. Los Maquinistas han elevado el nivel de alerta dimensional a AMARILLO.',
    tipo: 'urgente',
    autor: 'El Observatorio',
    fecha: '2026-02-11',
    prioridad: 'alta',
    leido: false,
  },
  {
    id: 'ZRK-2026-0050',
    titulo: 'Actualización del Registro Aeónico - Clase S',
    contenido:
      'La División de Cosmología Aplicada ha actualizado el expediente EON-003 (Nous). Se confirma estabilidad en los parámetros de comunicación con la Sociedad de Genios. Los investigadores Nivel 3+ pueden acceder al documento completo en la sección de Artículos Clasificados.',
    tipo: 'operativo',
    autor: 'División de Cosmología Aplicada',
    fecha: '2026-02-10',
    prioridad: 'media',
    leido: true,
  },
  {
    id: 'ZRK-2026-0049',
    titulo: 'Golden 21 - Fase Inicial en Progreso',
    contenido:
      'La reconstrucción del fragmento dimensional ZRK-21 ha iniciado oficialmente. Katherine M.2 reporta un 33% de progreso en la preparación de anclas de realidad. Se están estableciendo los primeros protocolos de estabilización. Los Zarek Ultra con experiencia en operaciones dimensionales deben contactar a la asistente del GPM para asignación.',
    tipo: 'urgente',
    autor: 'Los Maquinistas Everett',
    fecha: '2026-02-09',
    prioridad: 'alta',
    leido: true,
  },
  {
    id: 'ZRK-2026-0048',
    titulo: 'Calibración del Spark - Ultras Residentes',
    contenido:
      'La División de Ingeniería Sintética realizará calibraciones de mana azul para todos los Zarek Ultra residentes durante el Ciclo 21.8. Los portadores del Spark deben presentarse en el Sector Médico para evaluación de integridad arcana. Esto es obligatorio para personal en servicio activo.',
    tipo: 'mantenimiento',
    autor: 'División de Ingeniería Sintética',
    fecha: '2026-02-08',
    prioridad: 'media',
    leido: true,
  },
  {
    id: 'ZRK-2026-0047',
    titulo: 'Nuevo Zareks Interdimensionales - Protocolo de Integración',
    contenido:
      'Se han registrado 3 nuevos Zareks provenientes de dimensiones externas durante el último ciclo. Los Maquinistas recuerdan a todo el personal que los recién llegados deben completar el programa de orientación antes de acceder a áreas clasificadas. La diversidad dimensional fortalece nuestra misión de Erudición.',
    tipo: 'info',
    autor: 'Los Maquinistas Everett',
    fecha: '2026-02-07',
    prioridad: 'baja',
    leido: true,
  },
  {
    id: 'ZRK-2026-0046',
    titulo: 'Alerta: Fluctuación Energética Detectada',
    contenido:
      'El Observatorio ha detectado patrones de energía anómalos en la Dimensión ZRA-69. El origen de estas fluctuaciones aún está siendo investigado por la División de Cosmología Aplicada. Se recomienda precaución extrema. Personal asignado a esa región debe reportar cualquier anomalía inmediatamente.',
    tipo: 'urgente',
    autor: 'Sociedad de Genios - Inteligencia',
    fecha: '2026-02-06',
    prioridad: 'alta',
    leido: true,
  },
  {
    id: 'ZRK-2026-0045',
    titulo: 'Mantenimiento: Portales del Nexo Central',
    contenido:
      'Los portales interdimensionales del Nexo Central estarán en mantenimiento preventivo del 14 al 16 de febrero. El tránsito hacia dimensiones externas estará limitado. Los Ultras con capacidad de viaje personal no se ven afectados. Planifique sus desplazamientos con anticipación.',
    tipo: 'mantenimiento',
    autor: 'División de Tránsito Dimensional',
    fecha: '2026-02-05',
    prioridad: 'media',
    leido: true,
  },
  {
    id: 'ZRK-2026-0044',
    titulo: 'Recordatorio: Doctrina del Fundador',
    contenido:
      '"A través de infinitas realidades, el genio encuentra un camino. Aquí, encuentra un hogar." — Everett Zarek. Los Maquinistas invitan a todo el personal a la lectura mensual de los textos fundacionales en el Archivo Central. La asistencia es voluntaria pero recomendada para nuevos integrantes.',
    tipo: 'info',
    autor: 'Archivos Centrales',
    fecha: '2026-02-04',
    prioridad: 'baja',
    leido: true,
  },
];

function getTipoIcon(tipo: string): string {
  switch (tipo) {
    case 'urgente':
      return 'fas fa-exclamation-triangle';
    case 'operativo':
      return 'fas fa-shield-alt';
    case 'mantenimiento':
      return 'fas fa-tools';
    case 'info':
      return 'fas fa-info-circle';
    default:
      return 'fas fa-bell';
  }
}

function getTipoLabel(tipo: string): string {
  switch (tipo) {
    case 'urgente':
      return 'URGENTE';
    case 'operativo':
      return 'OPERATIVO';
    case 'mantenimiento':
      return 'MANTENIMIENTO';
    case 'info':
      return 'INFORMATIVO';
    default:
      return tipo.toUpperCase();
  }
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function Anuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(ANUNCIOS_INICIALES);
  const [filtroActivo, setFiltroActivo] = useState<Filtro>('todos');

  const anunciosFiltrados = useMemo(
    () =>
      filtroActivo === 'todos'
        ? anuncios
        : anuncios.filter((a) => a.tipo === filtroActivo),
    [anuncios, filtroActivo]
  );

  const noLeidos = useMemo(
    () => anuncios.filter((a) => !a.leido).length,
    [anuncios]
  );

  const marcarLeido = (id: string) => {
    setAnuncios((prev) =>
      prev.map((a) => (a.id === id ? { ...a, leido: true } : a))
    );
  };

  return (
    <div className="anuncios-container">
      {/* Header */}
      <div className="anuncios-header">
        <div className="header-info">
          <div className="header-icon">
            <i className="fas fa-bullhorn" />
          </div>
          <div className="header-text">
            <h1>Comunicados de la Ciudadela</h1>
            <p className="header-subtitle">
              Centro de anuncios y notificaciones oficiales
            </p>
          </div>
        </div>
        <div className="header-stats">
          {noLeidos > 0 && (
            <span className="badge-unread">
              <i className="fas fa-envelope" />
              {noLeidos} sin leer
            </span>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-bar">
        <button
          className={`filtro-btn${filtroActivo === 'todos' ? ' active' : ''}`}
          onClick={() => setFiltroActivo('todos')}
        >
          <i className="fas fa-list" />
          Todos
        </button>
        <button
          className={`filtro-btn urgente${filtroActivo === 'urgente' ? ' active' : ''}`}
          onClick={() => setFiltroActivo('urgente')}
        >
          <i className="fas fa-exclamation-triangle" />
          Urgentes
        </button>
        <button
          className={`filtro-btn operativo${filtroActivo === 'operativo' ? ' active' : ''}`}
          onClick={() => setFiltroActivo('operativo')}
        >
          <i className="fas fa-shield-alt" />
          Operativos
        </button>
        <button
          className={`filtro-btn mantenimiento${filtroActivo === 'mantenimiento' ? ' active' : ''}`}
          onClick={() => setFiltroActivo('mantenimiento')}
        >
          <i className="fas fa-tools" />
          Mantenimiento
        </button>
        <button
          className={`filtro-btn info${filtroActivo === 'info' ? ' active' : ''}`}
          onClick={() => setFiltroActivo('info')}
        >
          <i className="fas fa-info-circle" />
          Informativos
        </button>
      </div>

      {/* Lista de Anuncios */}
      <div className="anuncios-list">
        {anunciosFiltrados.map((anuncio) => (
          <div
            key={anuncio.id}
            className={`anuncio-card tipo-${anuncio.tipo}${
              !anuncio.leido ? ' no-leido' : ''
            }`}
            onClick={() => marcarLeido(anuncio.id)}
          >
            <div className="anuncio-header">
              <div className="anuncio-tipo">
                <i className={getTipoIcon(anuncio.tipo)} />
                <span className="tipo-label">{getTipoLabel(anuncio.tipo)}</span>
              </div>
              <div className="anuncio-meta">
                <span className="anuncio-id">{anuncio.id}</span>
                <span className="anuncio-fecha">{anuncio.fecha}</span>
              </div>
            </div>

            <h3 className="anuncio-titulo">
              {!anuncio.leido && <span className="dot-unread" />}
              {anuncio.titulo}
            </h3>

            <p className="anuncio-contenido">{anuncio.contenido}</p>

            <div className="anuncio-footer">
              <span className="anuncio-autor">
                <i className="fas fa-user-tie" />
                {anuncio.autor}
              </span>
              <span className={`anuncio-prioridad prioridad-${anuncio.prioridad}`}>
                Prioridad: {titleCase(anuncio.prioridad)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="anuncios-footer">
        <div className="footer-info">
          <i className="fas fa-info-circle" />
          <span>
            Los comunicados oficiales son emitidos por la Administración Central
            de la Ciudadela Zarek
          </span>
        </div>
      </div>
    </div>
  );
}
