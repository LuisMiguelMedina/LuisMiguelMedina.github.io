import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Personal {
  id: string;
  uuid: string;
  nombre: string;
  puesto: string;
  departamento: string;
  nivel: 1 | 2 | 3 | 4;
  estado: 'activo' | 'en-mision' | 'licencia' | 'inactivo';
  imagen: string;
  ubicacion: string;
  especialidad: string;
  fechaIngreso: string;
  variante: 'Original' | 'Ultra' | 'Anomalo' | 'Everett';
  proyecto?: string;
}

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './directorio.html',
  styleUrl: './directorio.scss'
})
export class Directorio {
  busqueda = '';
  filtroDepartamento = 'todos';
  filtroNivel = 'todos';

  personal: Personal[] = [
    {
      id: 'ZRK-001',
      uuid: 'KTH-M2-0021',
      nombre: 'Katherine M.2',
      puesto: 'Subdirectora Asistente - Golden 21',
      departamento: 'Operaciones Dimensionales',
      nivel: 2,
      estado: 'activo',
      imagen: '/assets/img/avatars/katherine.png',
      ubicacion: 'Nexo Central - Sector Alfa',
      especialidad: 'Comando Táctico / Ingeniería de Combate',
      fechaIngreso: 'Ciclo 20.3',
      variante: 'Ultra',
      proyecto: 'Golden 21'
    },
    {
      id: 'ZRK-002',
      uuid: 'MQN-E1-0002',
      nombre: 'Hugh Everett',
      puesto: 'Maquinista Senior',
      departamento: 'Los Maquinistas',
      nivel: 4,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar1.jpg',
      ubicacion: 'Nexo Central - Sala de Gobierno',
      especialidad: 'Filosofía Fundacional / Administración',
      fechaIngreso: 'Ciclo 12.1',
      variante: 'Original'
    },
    {
      id: 'ZRK-003',
      uuid: 'NVA-S3-0089',
      nombre: 'Emmy Noether',
      puesto: 'Investigadora Cosmológica',
      departamento: 'División de Cosmología Aplicada',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar2.jpg',
      ubicacion: 'El Observatorio',
      especialidad: 'Monitoreo Aeónico / Sendas',
      fechaIngreso: 'Ciclo 18.7',
      variante: 'Original'
    },
    {
      id: 'ZRK-004',
      uuid: 'VLX-U2-0156',
      nombre: 'Max Planck',
      puesto: 'Explorador Dimensional',
      departamento: 'Operaciones Dimensionales',
      nivel: 2,
      estado: 'en-mision',
      imagen: '/assets/img/avatars/avatar3.jpg',
      ubicacion: 'Dimensión 21-E - Campo',
      especialidad: 'Reconocimiento / The Spark',
      fechaIngreso: 'Ciclo 19.2',
      variante: 'Ultra'
    },
    {
      id: 'ZRK-005',
      uuid: 'EVR-D7-0012',
      nombre: 'Kaluza Zarek (Dimensión Tau)',
      puesto: 'Consultor Estratégico Dimensional',
      departamento: 'Los Maquinistas',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar4.jpg',
      ubicacion: 'Sala de Gobierno - Cámara de Consejo',
      especialidad: 'Filosofía Fundacional / Estrategia Multiversal',
      fechaIngreso: 'Ciclo 20.8',
      variante: 'Everett'
    },
    {
      id: 'ZRK-006',
      uuid: 'ARX-O3-0045',
      nombre: 'Paul Dirac',
      puesto: 'Archivista Senior',
      departamento: 'Los Archivos',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar5.jpg',
      ubicacion: 'Los Archivos - Conocimiento Unificado',
      especialidad: 'Síntesis de Conocimiento Multiversal',
      fechaIngreso: 'Ciclo 15.5',
      variante: 'Original'
    },
    {
      id: 'ZRK-007',
      uuid: 'FLX-N2-0312',
      nombre: 'Werner Heisenberg',
      puesto: 'Especialista en Contención',
      departamento: 'Operaciones Dimensionales',
      nivel: 2,
      estado: 'en-mision',
      imagen: '/assets/img/avatars/avatar6.jpg',
      ubicacion: 'Frontera D1-D2 - Misión CONTAIN-BETA',
      especialidad: 'Barreras de Energía / Fisuras',
      fechaIngreso: 'Ciclo 20.8',
      variante: 'Anomalo'
    },
    {
      id: 'ZRK-008',
      uuid: 'GNS-S4-0008',
      nombre: 'Dr. Richard Feynman',
      puesto: 'Miembro de la Sociedad de Genios',
      departamento: 'Sociedad de Genios',
      nivel: 4,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar7.jpg',
      ubicacion: 'Nexo Central - Comunión con Nous',
      especialidad: 'Consulta con Nous / Erudición',
      fechaIngreso: 'Ciclo 10.2',
      variante: 'Original'
    },
    {
      id: 'ZRK-009',
      uuid: 'TRN-U2-0178',
      nombre: 'Michio Kaku',
      puesto: 'Piloto del Nexo Central',
      departamento: 'División de Tránsito',
      nivel: 2,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar1.jpg',
      ubicacion: 'Nexo Central - Centro de Portales',
      especialidad: 'Navegación Interdimensional',
      fechaIngreso: 'Ciclo 19.9',
      variante: 'Ultra'
    },
    {
      id: 'ZRK-010',
      uuid: 'SPK-A1-0401',
      nombre: 'Erwin Schrödinger',
      puesto: 'Analista de Anomalías',
      departamento: 'División de Cosmología Aplicada',
      nivel: 1,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar2.jpg',
      ubicacion: 'El Observatorio - Monitoreo',
      especialidad: 'Detección de Stellarons',
      fechaIngreso: 'Ciclo 21.4',
      variante: 'Anomalo'
    },
    {
      id: 'ZRK-011',
      uuid: 'JKL-A1-0777',
      nombre: 'Dr. Jeckyll',
      puesto: 'Asistente de Proyecto',
      departamento: 'Operaciones Dimensionales',
      nivel: 1,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar3.jpg',
      ubicacion: 'Nexo Central - Sector Alfa',
      especialidad: 'Análisis de Datos / Apoyo Táctico',
      fechaIngreso: 'Ciclo 20.3',
      variante: 'Ultra',
      proyecto: 'Golden 21'
    },
    {
      id: 'ZRK-012',
      uuid: 'AZK-G4-0003',
      nombre: 'Amanda Zarek',
      puesto: 'Gerente de Proyecto',
      departamento: 'Los Maquinistas',
      nivel: 4,
      estado: 'inactivo',
      imagen: '/assets/img/avatars/avatar4.jpg',
      ubicacion: 'Nexo Central - Sala de Gobierno',
      especialidad: 'Administración Multiversal / Dirección Estratégica',
      fechaIngreso: 'Ciclo 14.2',
      variante: 'Everett',
      proyecto: 'Golden 21'
    },
    {
      id: 'ZRK-013',
      uuid: 'MSM-S3-0142',
      nombre: 'Martin Seamus',
      puesto: 'Supervisor de Control Cronotemporal',
      departamento: 'Control Cronotemporal',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar5.jpg',
      ubicacion: 'Nexo Central - División Temporal',
      especialidad: 'Paradojas Temporales / Líneas de Tiempo',
      fechaIngreso: 'Ciclo 17.6',
      variante: 'Original',
      proyecto: 'Golden 21'
    }
  ];

  departamentos = [
    'todos',
    'Operaciones Dimensionales',
    'Los Maquinistas',
    'División de Cosmología Aplicada',
    'Ingeniería Sintética',
    'Los Archivos',
    'Sociedad de Genios',
    'División de Tránsito',
    'Control Cronotemporal'
  ];

  get personalFiltrado(): Personal[] {
    return this.personal.filter(p => {
      const coincideBusqueda = this.busqueda === '' || 
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.puesto.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        p.uuid.toLowerCase().includes(this.busqueda.toLowerCase());
      
      const coincideDepartamento = this.filtroDepartamento === 'todos' || 
        p.departamento === this.filtroDepartamento;
      
      const coincideNivel = this.filtroNivel === 'todos' || 
        p.nivel === parseInt(this.filtroNivel);
      
      return coincideBusqueda && coincideDepartamento && coincideNivel;
    });
  }

  get totalActivos(): number {
    return this.personal.filter(p => p.estado === 'activo').length;
  }

  get totalEnMision(): number {
    return this.personal.filter(p => p.estado === 'en-mision').length;
  }

  getNivelLabel(nivel: number): string {
    switch (nivel) {
      case 1: return 'APM';
      case 2: return 'PM';
      case 3: return 'Senior PM';
      case 4: return 'GPM';
      default: return 'N/A';
    }
  }

  getNivelColor(nivel: number): string {
    switch (nivel) {
      case 1: return '#90EE90';
      case 2: return '#4A90D9';
      case 3: return '#9B59B6';
      case 4: return '#FFD700';
      default: return '#808080';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'en-mision': return 'En Misión';
      case 'licencia': return 'Licencia';
      case 'inactivo': return 'Inactivo';
      default: return estado;
    }
  }

  getVarianteLabel(variante: string): string {
    switch (variante) {
      case 'Ultra': return 'Zarek Ultra';
      case 'Original': return 'Zarek Original';
      case 'Anomalo': return 'Zarek Anomalo';
      case 'Everett': return 'Divergencia Zarek';
      default: return variante;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/favicon.ico';
  }
}
