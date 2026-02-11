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
      codigo: 'GOLDEN-ECHO-7',
      nombre: 'Estabilización del Fragmento Epsilon',
      tipo: 'contencion',
      estado: 'activa',
      prioridad: 'critica',
      dimension: 'Dimensión 21-E',
      fechaInicio: '2026-02-01',
      lider: 'Katherine M.2',
      equipoSize: 5,
      objetivos: [
        'Establecer perímetro de contención',
        'Neutralizar anomalías de clase Delta',
        'Instalar anclas de realidad'
      ],
      progreso: 67,
      clasificacion: 'alto-secreto'
    },
    {
      id: 'MSN-002',
      codigo: 'RECON-SIGMA-3',
      nombre: 'Reconocimiento Sector Gamma-7',
      tipo: 'reconocimiento',
      estado: 'activa',
      prioridad: 'alta',
      dimension: 'Dimensión 1',
      fechaInicio: '2026-02-08',
      lider: 'Diego Torres',
      equipoSize: 3,
      objetivos: [
        'Mapear zonas de inestabilidad',
        'Recopilar muestras de energía residual',
        'Documentar anomalías visuales'
      ],
      progreso: 45,
      clasificacion: 'secreto'
    },
    {
      id: 'MSN-003',
      codigo: 'EXTRACT-OMEGA-1',
      nombre: 'Extracción de Artefacto Temporal',
      tipo: 'extraccion',
      estado: 'pendiente',
      prioridad: 'alta',
      dimension: 'Dimensión 21-A',
      fechaInicio: '2026-02-15',
      lider: 'Victor Domínguez',
      equipoSize: 4,
      objetivos: [
        'Localizar artefacto designado OBJ-2147',
        'Asegurar zona de extracción',
        'Transportar a Ciudadela Zarek'
      ],
      progreso: 0,
      clasificacion: 'alto-secreto'
    },
    {
      id: 'MSN-004',
      codigo: 'INVEST-DELTA-9',
      nombre: 'Análisis de Brecha Cuántica',
      tipo: 'investigacion',
      estado: 'completada',
      prioridad: 'media',
      dimension: 'Dimensión 2',
      fechaInicio: '2026-01-15',
      fechaFin: '2026-02-05',
      lider: 'María Santos',
      equipoSize: 2,
      objetivos: [
        'Medir fluctuaciones cuánticas',
        'Analizar patrones de degradación',
        'Elaborar informe de riesgos'
      ],
      progreso: 100,
      clasificacion: 'confidencial'
    },
    {
      id: 'MSN-005',
      codigo: 'RESCUE-ALPHA-2',
      nombre: 'Recuperación Equipo Perdido',
      tipo: 'rescate',
      estado: 'completada',
      prioridad: 'critica',
      dimension: 'Dimensión 21-C',
      fechaInicio: '2026-01-28',
      fechaFin: '2026-01-30',
      lider: 'Elena Castillo',
      equipoSize: 6,
      objetivos: [
        'Localizar equipo SIGMA-4',
        'Establecer comunicación',
        'Extracción segura a Ciudadela'
      ],
      progreso: 100,
      clasificacion: 'secreto'
    },
    {
      id: 'MSN-006',
      codigo: 'CONTAIN-BETA-5',
      nombre: 'Sellado de Fisura Dimensional',
      tipo: 'contencion',
      estado: 'activa',
      prioridad: 'alta',
      dimension: 'Frontera D1-D2',
      fechaInicio: '2026-02-10',
      lider: 'Ana Rodríguez',
      equipoSize: 8,
      objetivos: [
        'Contener expansión de fisura',
        'Desplegar barreras de energía',
        'Monitoreo continuo 72h'
      ],
      progreso: 23,
      clasificacion: 'alto-secreto'
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
