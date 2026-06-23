import { useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { permissionsForLevel } from '../permissions';
import './Articulos.scss';

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

const KATHERINE_HR_CONTENT = `## Registro de Personal

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

Previo a su asignación como supervisora de operaciones en Golden 21, completó todas las evaluaciones de combate y aptitud estratégica requeridas, superando los benchmarks establecidos por su predecesora.

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

const INITIAL_FILES: ArticleFile[] = [
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
        content: KATHERINE_HR_CONTENT,
      },
    ],
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
        children: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Protocolos',
    path: '/Protocolos',
    type: 'folder',
    children: [],
  },
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Inline markdown: bold, italic, inline code, links. Operates on already
// HTML-escaped text.
function renderInline(text: string): string {
  let html = text;
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return html;
}

// Minimal markdown -> HTML renderer covering the subset used by the archive
// documents: headings, blockquotes, tables, lists, hr, paragraphs and inline
// emphasis. Replaces the legacy `marked` dependency (kept faithful to output).
function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let i = 0;

  const isTableSeparator = (line: string): boolean =>
    /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes('-');

  const splitRow = (line: string): string[] => {
    let row = line.trim();
    if (row.startsWith('|')) row = row.slice(1);
    if (row.endsWith('|')) row = row.slice(0, -1);
    return row.split('|').map((c) => c.trim());
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      out.push('<hr />');
      i++;
      continue;
    }

    // Headings
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(escapeHtml(heading[2]))}</h${level}>`);
      i++;
      continue;
    }

    // Table: current line contains a pipe and the next line is a separator
    if (
      trimmed.includes('|') &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const headers = splitRow(line);
      i += 2; // skip header + separator
      const bodyRows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      const thead =
        '<thead><tr>' +
        headers.map((h) => `<th>${renderInline(escapeHtml(h))}</th>`).join('') +
        '</tr></thead>';
      const tbody =
        '<tbody>' +
        bodyRows
          .map(
            (r) =>
              '<tr>' +
              r.map((c) => `<td>${renderInline(escapeHtml(c))}</td>`).join('') +
              '</tr>',
          )
          .join('') +
        '</tbody>';
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Blockquote (collapse consecutive > lines)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const inner = quoteLines
        .filter((l) => l.trim() !== '')
        .map((l) => `<p>${renderInline(escapeHtml(l))}</p>`)
        .join('');
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      out.push(
        '<ul>' +
          items.map((it) => `<li>${renderInline(escapeHtml(it))}</li>`).join('') +
          '</ul>',
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(
        '<ol>' +
          items.map((it) => `<li>${renderInline(escapeHtml(it))}</li>`).join('') +
          '</ol>',
      );
      continue;
    }

    // Paragraph (collapse consecutive plain lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,6})\s+/.test(lines[i].trim()) &&
      !/^---+$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(
        lines[i].includes('|') &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1])
      )
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      out.push(`<p>${renderInline(escapeHtml(paraLines.join(' ')))}</p>`);
    }
  }

  return out.join('\n');
}

function getFileIcon(file: ArticleFile): string {
  if (file.type === 'folder') {
    return 'fas fa-folder';
  }
  if (file.name.endsWith('.md')) {
    return 'fas fa-file-alt';
  }
  return 'fas fa-file';
}

export function Articulos() {
  const { level } = useAuth();
  const canView = permissionsForLevel(level).canViewArticulos;

  const [files] = useState<ArticleFile[]>(INITIAL_FILES);
  const [currentPath, setCurrentPath] = useState<string[]>(['Documentos']);
  const [selectedFile, setSelectedFile] = useState<ArticleFile | null>(null);
  const [viewMode, setViewMode] = useState<'explorer' | 'reader'>('explorer');

  const currentFolder = useMemo<ArticleFile[]>(() => {
    if (currentPath.length === 1) {
      return files;
    }
    let current: ArticleFile[] = files;
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.find((f) => f.name === currentPath[i]);
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current;
  }, [files, currentPath]);

  const renderedContent = useMemo<string>(() => {
    if (viewMode !== 'reader' || !selectedFile?.content) {
      return '';
    }
    try {
      return renderMarkdown(selectedFile.content);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return '<p>Error al renderizar el documento</p>';
    }
  }, [viewMode, selectedFile]);

  const navigateToFolder = (folder: ArticleFile): void => {
    if (folder.type === 'folder') {
      setCurrentPath((path) => [...path, folder.name]);
    }
  };

  const navigateUp = (): void => {
    setCurrentPath((path) => (path.length > 1 ? path.slice(0, -1) : path));
  };

  const navigateToPath = (index: number): void => {
    setCurrentPath((path) => path.slice(0, index + 1));
  };

  const openFile = (file: ArticleFile): void => {
    if (file.type === 'file' && file.content) {
      setSelectedFile(file);
      setViewMode('reader');
    }
  };

  const closeReader = (): void => {
    setViewMode('explorer');
    setSelectedFile(null);
  };

  if (!canView) {
    return (
      <div className="articulos-container">
        <div className="articulos-header">
          <div className="header-title">
            <i className="fas fa-folder-open" />
            <h1>Archivo de Documentos</h1>
          </div>
          <div className="header-info">
            <span className="classification-badge">
              <i className="fas fa-shield-alt" />
              NIVEL 3+ REQUERIDO
            </span>
          </div>
        </div>
        <div className="empty-folder">
          <i className="fas fa-lock" />
          <p>Acceso restringido. Se requiere autorización Nivel 3 o superior.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="articulos-container">
      {/* Header */}
      <div className="articulos-header">
        <div className="header-title">
          <i className="fas fa-folder-open" />
          <h1>Archivo de Documentos</h1>
        </div>
        <div className="header-info">
          <span className="classification-badge">
            <i className="fas fa-shield-alt" />
            NIVEL 3+ REQUERIDO
          </span>
        </div>
      </div>

      {viewMode === 'explorer' && (
        <div className="explorer-view">
          {/* Breadcrumb */}
          <div className="breadcrumb-bar">
            <div className="breadcrumb">
              {currentPath.map((segment, i) => (
                <span key={segment + i} style={{ display: 'contents' }}>
                  <button className="breadcrumb-item" onClick={() => navigateToPath(i)}>
                    {i === 0 && <i className="fas fa-home" />}
                    {segment}
                  </button>
                  {i < currentPath.length - 1 && (
                    <i className="fas fa-chevron-right separator" />
                  )}
                </span>
              ))}
            </div>
            {currentPath.length > 1 && (
              <button className="back-btn" onClick={navigateUp}>
                <i className="fas fa-arrow-left" />
                Atrás
              </button>
            )}
          </div>

          {/* File Grid */}
          <div className="file-grid">
            {currentFolder.length > 0 ? (
              currentFolder.map((file) => (
                <div
                  key={file.id}
                  className={file.type === 'folder' ? 'file-item folder' : 'file-item'}
                  onClick={() =>
                    file.type === 'folder' ? navigateToFolder(file) : openFile(file)
                  }
                >
                  <div className="file-icon">
                    <i className={getFileIcon(file)} />
                  </div>
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    {file.type === 'file' && (
                      <span className="file-meta">
                        {file.lastModified} • {file.size}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-folder">
                <i className="fas fa-folder-open" />
                <p>Esta carpeta está vacía</p>
              </div>
            )}
          </div>
        </div>
      )}

      {viewMode === 'reader' && (
        <div className="reader-view">
          {/* Reader Header */}
          <div className="reader-header">
            <button className="close-reader" onClick={closeReader}>
              <i className="fas fa-arrow-left" />
              Volver al explorador
            </button>
            <div className="document-title">
              <i className="fas fa-file-alt" />
              <span>{selectedFile?.name}</span>
            </div>
            <div className="document-meta">
              <span>
                <i className="fas fa-clock" /> {selectedFile?.lastModified}
              </span>
              <span>
                <i className="fas fa-hdd" /> {selectedFile?.size}
              </span>
            </div>
          </div>

          {/* Markdown Content */}
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />

          {/* Reader Footer */}
          <div className="reader-footer">
            <div className="footer-stamp">
              <i className="fas fa-lock" />
              DOCUMENTO CLASIFICADO - CIUDADELA ZAREK
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
