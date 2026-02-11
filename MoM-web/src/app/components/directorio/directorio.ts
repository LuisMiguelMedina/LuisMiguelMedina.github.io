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
      id: 'DIR-001',
      uuid: 'KTH-M2-0021',
      nombre: 'Katherine M.2',
      puesto: 'Subdirectora Asistente',
      departamento: 'Operaciones Dimensionales',
      nivel: 2,
      estado: 'activo',
      imagen: '/assets/img/avatars/katherine.png',
      ubicacion: 'Ciudadela Zarek - Sector Alpha',
      especialidad: 'Comando Táctico / Ingeniería de Combate',
      fechaIngreso: '2025-03-15'
    },
    {
      id: 'DIR-002',
      uuid: 'VCT-D1-0003',
      nombre: 'Victor Domínguez',
      puesto: 'Ingeniero Senior',
      departamento: 'Ingeniería Táctica',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar1.jpg',
      ubicacion: 'Ciudadela Zarek - Laboratorios',
      especialidad: 'Sistemas de Contención',
      fechaIngreso: '2024-08-22'
    },
    {
      id: 'DIR-003',
      uuid: 'MRA-S2-0015',
      nombre: 'María Santos',
      puesto: 'Analista de Anomalías',
      departamento: 'Investigación',
      nivel: 2,
      estado: 'en-mision',
      imagen: '/assets/img/avatars/avatar2.jpg',
      ubicacion: 'Dimensión 1 - Misión de Campo',
      especialidad: 'Análisis Dimensional',
      fechaIngreso: '2025-01-10'
    },
    {
      id: 'DIR-004',
      uuid: 'RCH-A1-0028',
      nombre: 'Ricardo Hernández',
      puesto: 'Técnico de Sistemas',
      departamento: 'Ingeniería Sintética',
      nivel: 1,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar3.jpg',
      ubicacion: 'Ciudadela Zarek - Centro de Datos',
      especialidad: 'Mantenimiento de IA',
      fechaIngreso: '2025-06-01'
    },
    {
      id: 'DIR-005',
      uuid: 'ELN-C3-0007',
      nombre: 'Elena Castillo',
      puesto: 'Coordinadora de Operaciones',
      departamento: 'Operaciones Dimensionales',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar4.jpg',
      ubicacion: 'Ciudadela Zarek - Centro de Mando',
      especialidad: 'Logística Multidimensional',
      fechaIngreso: '2024-04-15'
    },
    {
      id: 'DIR-006',
      uuid: 'JRG-M1-0042',
      nombre: 'Jorge Méndez',
      puesto: 'Especialista en Seguridad',
      departamento: 'Seguridad',
      nivel: 2,
      estado: 'licencia',
      imagen: '/assets/img/avatars/avatar5.jpg',
      ubicacion: 'Fuera de Servicio',
      especialidad: 'Protocolos de Contención',
      fechaIngreso: '2024-11-30'
    },
    {
      id: 'DIR-007',
      uuid: 'ANA-R4-0001',
      nombre: 'Ana Rodríguez',
      puesto: 'Directora de Proyecto',
      departamento: 'Dirección',
      nivel: 4,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar6.jpg',
      ubicacion: 'Ciudadela Zarek - Torre de Comando',
      especialidad: 'Gestión Estratégica',
      fechaIngreso: '2023-01-01'
    },
    {
      id: 'DIR-008',
      uuid: 'DGO-T2-0019',
      nombre: 'Diego Torres',
      puesto: 'Piloto Dimensional',
      departamento: 'Operaciones Dimensionales',
      nivel: 2,
      estado: 'en-mision',
      imagen: '/assets/img/avatars/avatar7.jpg',
      ubicacion: 'Tránsito Dimensional',
      especialidad: 'Navegación Interdimensional',
      fechaIngreso: '2024-09-12'
    }
  ];

  departamentos = [
    'todos',
    'Operaciones Dimensionales',
    'Ingeniería Táctica',
    'Investigación',
    'Ingeniería Sintética',
    'Seguridad',
    'Dirección'
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
}
