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
      id: 'ZRK-2026-0051',
      titulo: 'Detección de Firma Antimateria en Sector Gamma-7',
      contenido: 'Los sensores del Observatorio han registrado fluctuaciones de antimateria consistentes con actividad de la Legión Antimateria en las proximidades del Sector Gamma-7. Se recomienda a todo el personal en misión evitar tránsito por esa región. Los Maquinistas han elevado el nivel de alerta dimensional a AMARILLO.',
      tipo: 'urgente',
      autor: 'El Observatorio',
      fecha: '2026-02-11',
      prioridad: 'alta',
      leido: false
    },
    {
      id: 'ZRK-2026-0050',
      titulo: 'Actualización del Registro Aeónico - Clase S',
      contenido: 'La División de Cosmología Aplicada ha actualizado el expediente EON-003 (Nous). Se confirma estabilidad en los parámetros de comunicación con la Sociedad de Genios. Los investigadores Nivel 3+ pueden acceder al documento completo en la sección de Artículos Clasificados.',
      tipo: 'operativo',
      autor: 'División de Cosmología Aplicada',
      fecha: '2026-02-10',
      prioridad: 'media',
      leido: true
    },
    {
      id: 'ZRK-2026-0049',
      titulo: 'Golden 21 - Fase Inicial en Progreso',
      contenido: 'La reconstrucción del fragmento dimensional 21-E ha iniciado oficialmente. Katherine M.2 reporta un 33% de progreso en la preparación de anclas de realidad. Se están estableciendo los primeros protocolos de estabilización. Los Zarek Ultra con experiencia en operaciones dimensionales deben contactar a la asistente del GPM para asignación.',
      tipo: 'urgente',
      autor: 'Los Maquinistas Everett',
      fecha: '2026-02-09',
      prioridad: 'alta',
      leido: true
    },
    {
      id: 'ZRK-2026-0048',
      titulo: 'Calibración del Spark - Ultras Residentes',
      contenido: 'La División de Ingeniería Sintética realizará calibraciones de mana azul para todos los Zarek Ultra residentes durante el Ciclo 21.8. Los portadores del Spark deben presentarse en el Sector Médico para evaluación de integridad arcana. Esto es obligatorio para personal en servicio activo.',
      tipo: 'mantenimiento',
      autor: 'División de Ingeniería Sintética',
      fecha: '2026-02-08',
      prioridad: 'media',
      leido: true
    },
    {
      id: 'ZRK-2026-0047',
      titulo: 'Nuevo Zareks Interdimensionales - Protocolo de Integración',
      contenido: 'Se han registrado 3 nuevos Zareks provenientes de dimensiones externas durante el último ciclo. Los Maquinistas recuerdan a todo el personal que los recién llegados deben completar el programa de orientación antes de acceder a áreas clasificadas. La diversidad dimensional fortalece nuestra misión de Erudición.',
      tipo: 'info',
      autor: 'Los Maquinistas Everett',
      fecha: '2026-02-07',
      prioridad: 'baja',
      leido: true
    },
    {
      id: 'ZRK-2026-0046',
      titulo: 'Alerta: Fluctuación Energética Detectada',
      contenido: 'El Observatorio ha detectado patrones de energía anómalos en la Dimensión 21-C. El origen de estas fluctuaciones aún está siendo investigado por la División de Cosmología Aplicada. Se recomienda precaución extrema. Personal asignado a esa región debe reportar cualquier anomalía inmediatamente.',
      tipo: 'urgente',
      autor: 'Sociedad de Genios - Inteligencia',
      fecha: '2026-02-06',
      prioridad: 'alta',
      leido: true
    },
    {
      id: 'ZRK-2026-0045',
      titulo: 'Mantenimiento: Portales del Nexo Central',
      contenido: 'Los portales interdimensionales del Nexo Central estarán en mantenimiento preventivo del 14 al 16 de febrero. El tránsito hacia dimensiones externas estará limitado. Los Ultras con capacidad de viaje personal no se ven afectados. Planifique sus desplazamientos con anticipación.',
      tipo: 'mantenimiento',
      autor: 'División de Tránsito Dimensional',
      fecha: '2026-02-05',
      prioridad: 'media',
      leido: true
    },
    {
      id: 'ZRK-2026-0044',
      titulo: 'Recordatorio: Doctrina del Fundador',
      contenido: '"A través de infinitas realidades, el genio encuentra un camino. Aquí, encuentra un hogar." — Everett Zarek. Los Maquinistas invitan a todo el personal a la lectura mensual de los textos fundacionales en el Archivo Central. La asistencia es voluntaria pero recomendada para nuevos integrantes.',
      tipo: 'info',
      autor: 'Archivos Centrales',
      fecha: '2026-02-04',
      prioridad: 'baja',
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
