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
  variante: 'Original' | 'Ultra' | 'Anomalo' | 'Externo';
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
      ubicacion: 'Central Nexus - Sector Alpha',
      especialidad: 'Comando Táctico / Ingeniería de Combate',
      fechaIngreso: 'Ciclo 20.3',
      variante: 'Ultra'
    },
    {
      id: 'ZRK-002',
      uuid: 'MQN-E1-0002',
      nombre: 'Aldric Everett',
      puesto: 'Maquinista Senior',
      departamento: 'Los Maquinistas',
      nivel: 4,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar1.jpg',
      ubicacion: 'Central Nexus - Governance Hall',
      especialidad: 'Filosofía Fundacional / Administración',
      fechaIngreso: 'Ciclo 12.1',
      variante: 'Original'
    },
    {
      id: 'ZRK-003',
      uuid: 'NVA-S3-0089',
      nombre: 'Nova Synthesis',
      puesto: 'Investigadora Cosmológica',
      departamento: 'Applied Cosmology Division',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar2.jpg',
      ubicacion: 'The Observatory',
      especialidad: 'Monitoreo Aeónico / Paths',
      fechaIngreso: 'Ciclo 18.7',
      variante: 'Original'
    },
    {
      id: 'ZRK-004',
      uuid: 'VLX-U2-0156',
      nombre: 'Velix Wanderer',
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
      uuid: 'SYN-A1-0203',
      nombre: 'Sylas Unit-7',
      puesto: 'Técnico de Mantenimiento Sintético',
      departamento: 'Ingeniería Sintética',
      nivel: 1,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar4.jpg',
      ubicacion: 'Research Quarters - Lab 7',
      especialidad: 'Reparación de Chasis Sintéticos',
      fechaIngreso: 'Ciclo 21.1',
      variante: 'Externo'
    },
    {
      id: 'ZRK-006',
      uuid: 'ARX-O3-0045',
      nombre: 'Arx Theorum',
      puesto: 'Archivista Senior',
      departamento: 'The Archives',
      nivel: 3,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar5.jpg',
      ubicacion: 'The Archives - Unified Knowledge',
      especialidad: 'Síntesis de Conocimiento Multiversal',
      fechaIngreso: 'Ciclo 15.5',
      variante: 'Original'
    },
    {
      id: 'ZRK-007',
      uuid: 'FLX-N2-0312',
      nombre: 'Flux Anomaly',
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
      nombre: 'Dr. Meridian Vast',
      puesto: 'Miembro de Genius Society',
      departamento: 'Genius Society',
      nivel: 4,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar7.jpg',
      ubicacion: 'Central Nexus - Nous Communion',
      especialidad: 'Consulta con Nous / Erudition',
      fechaIngreso: 'Ciclo 10.2',
      variante: 'Original'
    },
    {
      id: 'ZRK-009',
      uuid: 'TRN-U2-0178',
      nombre: 'Transit Nomad',
      puesto: 'Piloto del Central Nexus',
      departamento: 'División de Tránsito',
      nivel: 2,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar1.jpg',
      ubicacion: 'Central Nexus - Portal Hub',
      especialidad: 'Navegación Interdimensional',
      fechaIngreso: 'Ciclo 19.9',
      variante: 'Ultra'
    },
    {
      id: 'ZRK-010',
      uuid: 'SPK-A1-0401',
      nombre: 'Cipher Glitch',
      puesto: 'Analista de Anomalías',
      departamento: 'Applied Cosmology Division',
      nivel: 1,
      estado: 'activo',
      imagen: '/assets/img/avatars/avatar2.jpg',
      ubicacion: 'The Observatory - Monitoring',
      especialidad: 'Detección de Stellarons',
      fechaIngreso: 'Ciclo 21.4',
      variante: 'Anomalo'
    }
  ];

  departamentos = [
    'todos',
    'Operaciones Dimensionales',
    'Los Maquinistas',
    'Applied Cosmology Division',
    'Ingeniería Sintética',
    'The Archives',
    'Genius Society',
    'División de Tránsito'
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
