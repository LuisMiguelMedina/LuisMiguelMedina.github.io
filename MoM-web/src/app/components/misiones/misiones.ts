import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Mision {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'reconocimiento' | 'extraccion' | 'contencion' | 'investigacion' | 'rescate';
  estado: 'activa' | 'completada' | 'pendiente' | 'cancelada';
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  dimension: string;
  fechaInicio: string;
  fechaFin?: string;
  lider: string;
  equipoSize: number;
  objetivos: string[];
  progreso: number;
  clasificacion: 'confidencial' | 'secreto' | 'alto-secreto';
}

@Component({
  selector: 'app-misiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './misiones.html',
  styleUrl: './misiones.scss'
})
export class Misiones {
  filtroEstado: 'todas' | 'activa' | 'completada' | 'pendiente' = 'todas';

  misiones: Mision[] = [
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
        'Reconstruir tejido dimensional al 85% de integridad'
      ],
      progreso: 67,
      clasificacion: 'alto-secreto'
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
      lider: 'Aldric Everett',
      equipoSize: 4,
      objetivos: [
        'Rastrear firma energética de la Legión Antimateria',
        'Identificar posible presencia de Señores de las Cenizas',
        'Establecer perímetro de alerta temprana',
        'Documentar tácticas de infiltración del enemigo'
      ],
      progreso: 32,
      clasificacion: 'alto-secreto'
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
      lider: 'Nova Synthesis',
      equipoSize: 6,
      objetivos: [
        'Neutralizar efectos de corrupción del Stellaron',
        'Evitar propagación a dimensiones adyacentes',
        'Capturar para análisis en Applied Cosmology Division'
      ],
      progreso: 45,
      clasificacion: 'alto-secreto'
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
      lider: 'Dr. Meridian Vast',
      equipoSize: 2,
      objetivos: [
        'Establecer conexión con el Aeon de la Erudición',
        'Descargar actualizaciones del conocimiento cósmico',
        'Integrar data con sistemas de The Archives'
      ],
      progreso: 78,
      clasificacion: 'secreto'
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
      fechaFin: '2026-01-30',
      lider: 'Flux Anomaly',
      equipoSize: 3,
      objetivos: [
        'Contener manifestación inestable del Spark',
        'Aplicar protocolo de regulación arcana',
        'Transporte seguro a cámara de estabilización'
      ],
      progreso: 100,
      clasificacion: 'confidencial'
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
      fechaFin: '2026-02-03',
      lider: 'Transit Nomad',
      equipoSize: 8,
      objetivos: [
        'Recalibrar portales hacia dimensiones 1-5',
        'Reforzar barreras contra infiltración dimensional',
        'Actualizar protocolos de autenticación de viajeros'
      ],
      progreso: 100,
      clasificacion: 'secreto'
    },
    {
      id: 'MSN-007',
      codigo: 'HUNTERS-TRACK-1',
      nombre: 'Rastreo de Cazadores de Stellaron',
      tipo: 'reconocimiento',
      estado: 'pendiente',
      prioridad: 'media',
      dimension: 'Múltiples',
      fechaInicio: '2026-02-20',
      lider: 'Velix Wanderer',
      equipoSize: 2,
      objetivos: [
        'Identificar movimientos de Elio y su tripulación',
        'Evaluar intenciones hacia la Ciudadela',
        'Reportar cualquier alianza con facciones hostiles'
      ],
      progreso: 0,
      clasificacion: 'secreto'
    },
    {
      id: 'MSN-008',
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
        'Actualizar registro de capacidades arcanas'
      ],
      progreso: 0,
      clasificacion: 'confidencial'
    }
  ];

  get misionesFiltradas(): Mision[] {
    if (this.filtroEstado === 'todas') {
      return this.misiones;
    }
    return this.misiones.filter(m => m.estado === this.filtroEstado);
  }

  get misionesActivas(): number {
    return this.misiones.filter(m => m.estado === 'activa').length;
  }

  get misionesCompletadas(): number {
    return this.misiones.filter(m => m.estado === 'completada').length;
  }

  get misionesPendientes(): number {
    return this.misiones.filter(m => m.estado === 'pendiente').length;
  }

  setFiltro(filtro: 'todas' | 'activa' | 'completada' | 'pendiente'): void {
    this.filtroEstado = filtro;
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'reconocimiento': return 'fas fa-binoculars';
      case 'extraccion': return 'fas fa-box';
      case 'contencion': return 'fas fa-shield-alt';
      case 'investigacion': return 'fas fa-flask';
      case 'rescate': return 'fas fa-life-ring';
      default: return 'fas fa-crosshairs';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'reconocimiento': return 'Reconocimiento';
      case 'extraccion': return 'Extracción';
      case 'contencion': return 'Contención';
      case 'investigacion': return 'Investigación';
      case 'rescate': return 'Rescate';
      default: return tipo;
    }
  }

  getClasificacionLabel(clasificacion: string): string {
    switch (clasificacion) {
      case 'confidencial': return 'CONFIDENCIAL';
      case 'secreto': return 'SECRETO';
      case 'alto-secreto': return 'ALTO SECRETO';
      default: return clasificacion.toUpperCase();
    }
  }
}
