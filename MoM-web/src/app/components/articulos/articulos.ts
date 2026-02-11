import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

interface ArticleFile {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: ArticleFile[];
  content?: string;
  lastModified?: string;
  size?: string;
}

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articulos.html',
  styleUrl: './articulos.scss'
})
export class Articulos {
  private sanitizer: DomSanitizer;

  // Estado del explorador
  currentPath = signal<string[]>(['Documentos']);
  selectedFile = signal<ArticleFile | null>(null);
  viewMode = signal<'explorer' | 'reader'>('explorer');
  
  // Archivos del sistema
  files = signal<ArticleFile[]>([
    {
      id: '1',
      name: 'Personal',
      path: '/Personal',
      type: 'folder',
      children: [
        {
          id: '1-1',
          name: 'Katherine M.2 - HR File.md',
          path: '/Personal/Katherine M.2 - HR File.md',
          type: 'file',
          lastModified: 'Ciclo 21.7',
          size: '4.2 KB',
          content: this.getKatherineHRContent()
        }
      ]
    },
    {
      id: '2',
      name: 'Proyectos',
      path: '/Proyectos',
      type: 'folder',
      children: [
        {
          id: '2-1',
          name: 'Golden 21',
          path: '/Proyectos/Golden 21',
          type: 'folder',
          children: []
        }
      ]
    },
    {
      id: '3',
      name: 'Protocolos',
      path: '/Protocolos',
      type: 'folder',
      children: []
    }
  ]);

  // Carpeta actual
  currentFolder = computed<ArticleFile[]>(() => {
    const path = this.currentPath();
    if (path.length === 1) {
      return this.files();
    }
    
    let current: ArticleFile[] = this.files();
    for (let i = 1; i < path.length; i++) {
      const folder = current.find(f => f.name === path[i]);
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current;
  });

  // Contenido renderizado del markdown
  renderedContent = signal<SafeHtml>('');

  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  navigateToFolder(folder: ArticleFile): void {
    if (folder.type === 'folder') {
      this.currentPath.update(path => [...path, folder.name]);
    }
  }

  navigateUp(): void {
    if (this.currentPath().length > 1) {
      this.currentPath.update(path => path.slice(0, -1));
    }
  }

  navigateToPath(index: number): void {
    this.currentPath.update(path => path.slice(0, index + 1));
  }

  openFile(file: ArticleFile): void {
    if (file.type === 'file' && file.content) {
      this.selectedFile.set(file);
      this.renderMarkdown(file.content);
      this.viewMode.set('reader');
    }
  }

  closeReader(): void {
    this.viewMode.set('explorer');
    this.selectedFile.set(null);
  }

  private async renderMarkdown(content: string): Promise<void> {
    try {
      const html = await marked(content);
      this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
    } catch (error) {
      console.error('Error rendering markdown:', error);
      this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml('<p>Error al renderizar el documento</p>'));
    }
  }

  getFileIcon(file: ArticleFile): string {
    if (file.type === 'folder') {
      return 'fas fa-folder';
    }
    if (file.name.endsWith('.md')) {
      return 'fas fa-file-alt';
    }
    return 'fas fa-file';
  }

  private getKatherineHRContent(): string {
    return `## Registro de Personal

> **CLASIFICACIÓN:** Interno — Solo personal autorizado  
> **Última actualización:** Ciclo 21.7  
> **Estado del archivo:** Vigente

### Datos Generales

| Campo | Información |
|-------|-------------|
| **Designación** | Katherine M.2 (Mark 2) |
| **Puesto actual** | Asistente del GPM — Golden 21 |
| **Departamento** | Operaciones Dimensionales / Ingeniería Táctica |
| **Base de operaciones** | Ciudadela Zarek |
| **Estatus** | Activa |
| **Tipo biológico** | Androide — Chasis militar sintético completo |
| **Variante** | Zarek Ultra (Reconstrucción Sintética) |

### Historial Profesional

Katherine M.2 fue comisionada como sucesora operativa de **Katherine Zarek** (fallecida en acción). Su perfil combina experiencia táctica de nivel Elite con capacidades administrativas avanzadas.

Previo a su asignación como asistente del GPM en Golden 21, completó todas las evaluaciones de combate y aptitud estratégica requeridas, superando los benchmarks establecidos por su predecesora.

**Áreas de competencia:**
- Operaciones militares y comando táctico
- Estabilización dimensional
- Ingeniería de combate
- Gestión de proyectos de alta prioridad

### Asignación Actual: Proyecto Golden 21

Asiste en la coordinación de la iniciativa de reconstrucción y estabilización de los fragmentos dimensionales derivados de los experimentos temporales en la Dimensión 21. El proyecto se encuentra actualmente en **Fase 2 (Echo)**.

Detalles clasificados del proyecto disponibles bajo solicitud con autorización Nivel 4 o superior.

### Evaluación de Desempeño

| Área | Calificación |
|------|-------------|
| Cumplimiento de misión | Excede expectativas |
| Liderazgo de equipo | Cumple expectativas |
| Preparación de combate | Capacidad plena |
| Rendimiento administrativo | Excede proyecciones |

---

### Notas de Seguimiento Psicológico

> ⚠️ **Nota confidencial — Acceso restringido**

La empleada presenta un perfil psicológico estable pero bajo monitoreo continuo. Se ha observado una tendencia hacia la introspección y un temperamento notablemente más reservado de lo esperado para personal con su historial operativo.

No se reporta degradación en su línea base emocional. No requiere intervención inmediata. Se recomienda mantener evaluaciones periódicas.

**Diagnóstico general:** Apta para servicio activo sin restricciones.

---

### Contacto de Emergencia

| Campo                     | Dato                                              |
| ------------------------- | ------------------------------------------------- |
| **Mantenimiento técnico** | División de Ingeniería Sintética, Ciudadela Zarek |
| **Soporte psicológico**   | Unidad de Bienestar - Casos Especiales            |

---

> *Este documento es propiedad de la Ciudadela Zarek. Su distribución fuera del sistema de intranet constituye una violación de los protocolos de seguridad interna.*`;
  }
}
