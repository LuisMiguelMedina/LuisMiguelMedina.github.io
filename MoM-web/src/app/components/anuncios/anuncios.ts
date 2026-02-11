import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  tipo: 'info' | 'urgente' | 'mantenimiento' | 'operativo';
  autor: string;
  fecha: string;
  prioridad: 'alta' | 'media' | 'baja';
  leido: boolean;
}

@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anuncios.html',
  styleUrl: './anuncios.scss'
})
export class Anuncios {
  anuncios: Anuncio[] = [
    {
      id: 'ANN-2026-0047',
      titulo: 'Actualización del Protocolo de Contención Delta',
      contenido: 'Se ha actualizado el protocolo de contención para anomalías de clase Delta. Todos los agentes deben revisar el manual actualizado antes del próximo ciclo operativo. Los cambios incluyen nuevas directrices para la manipulación de artefactos dimensionales y procedimientos de evacuación mejorados.',
      tipo: 'operativo',
      autor: 'Comando Central',
      fecha: '2026-02-11',
      prioridad: 'alta',
      leido: false
    },
    {
      id: 'ANN-2026-0046',
      titulo: 'Mantenimiento Programado - Sistemas de Comunicación',
      contenido: 'El sistema de comunicaciones interdimensional estará en mantenimiento el día 15 de febrero entre las 02:00 y 06:00 UTC. Durante este período, las comunicaciones con la Dimensión 1 estarán limitadas. Utilice canales de respaldo para emergencias.',
      tipo: 'mantenimiento',
      autor: 'División de Ingeniería',
      fecha: '2026-02-10',
      prioridad: 'media',
      leido: true
    },
    {
      id: 'ANN-2026-0045',
      titulo: 'Golden 21 - Fase 2 (Echo) Iniciada',
      contenido: 'La Fase 2 del Proyecto Golden 21 ha comenzado oficialmente. Todos los miembros asignados deben reportarse a sus estaciones designadas. La subdirectora asistente Katherine M.2 será responsable de la coordinación táctica durante esta fase.',
      tipo: 'urgente',
      autor: 'Dirección de Proyectos',
      fecha: '2026-02-09',
      prioridad: 'alta',
      leido: true
    },
    {
      id: 'ANN-2026-0044',
      titulo: 'Recordatorio: Evaluaciones de Desempeño Q1',
      contenido: 'Las evaluaciones de desempeño del primer trimestre están programadas para la última semana de marzo. Los supervisores deben completar los formularios de evaluación preliminar antes del 20 de marzo.',
      tipo: 'info',
      autor: 'Recursos Humanos',
      fecha: '2026-02-08',
      prioridad: 'baja',
      leido: true
    },
    {
      id: 'ANN-2026-0043',
      titulo: 'Nueva Biblioteca de Artefactos Disponible',
      contenido: 'Se ha habilitado acceso a la nueva biblioteca de artefactos clasificados en la sección de Artículos. Personal con nivel 3 o superior puede acceder a documentación extendida sobre anomalías catalogadas.',
      tipo: 'info',
      autor: 'Archivos Centrales',
      fecha: '2026-02-07',
      prioridad: 'media',
      leido: true
    },
    {
      id: 'ANN-2026-0042',
      titulo: 'Alerta de Seguridad - Intentos de Intrusión Detectados',
      contenido: 'Se han detectado múltiples intentos de acceso no autorizado al sistema de intranet. Se recomienda a todos los usuarios actualizar sus credenciales y activar la autenticación de dos factores si aún no lo han hecho.',
      tipo: 'urgente',
      autor: 'Seguridad',
      fecha: '2026-02-06',
      prioridad: 'alta',
      leido: true
    }
  ];

  filtroActivo: 'todos' | 'urgente' | 'operativo' | 'info' | 'mantenimiento' = 'todos';

  get anunciosFiltrados(): Anuncio[] {
    if (this.filtroActivo === 'todos') {
      return this.anuncios;
    }
    return this.anuncios.filter(a => a.tipo === this.filtroActivo);
  }

  get noLeidos(): number {
    return this.anuncios.filter(a => !a.leido).length;
  }

  setFiltro(filtro: 'todos' | 'urgente' | 'operativo' | 'info' | 'mantenimiento'): void {
    this.filtroActivo = filtro;
  }

  marcarLeido(anuncio: Anuncio): void {
    anuncio.leido = true;
  }

  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'urgente': return 'fas fa-exclamation-triangle';
      case 'operativo': return 'fas fa-shield-alt';
      case 'mantenimiento': return 'fas fa-tools';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-bell';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'urgente': return 'URGENTE';
      case 'operativo': return 'OPERATIVO';
      case 'mantenimiento': return 'MANTENIMIENTO';
      case 'info': return 'INFORMATIVO';
      default: return tipo.toUpperCase();
    }
  }
}
