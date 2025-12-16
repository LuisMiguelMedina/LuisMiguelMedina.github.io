import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private router = inject(Router);
  permissionsService = inject(PermissionsService);

  // Señales reactivas del PermissionsService
  adminSession = this.permissionsService.adminSession;
  adminLevel = this.permissionsService.adminLevel;
  menuItems = computed(() => this.permissionsService.getMenuItems());

  // Search
  searchQuery = '';
  searchResultCount = 0;
  private searchTimeout: any = null;

  // Helpers para el template
  getLevelName(): string {
    return this.permissionsService.getLevelName();
  }

  getLevelColor(): string {
    return this.permissionsService.getLevelColor();
  }

  logout(): void {
    this.permissionsService.clearSession();
    this.router.navigate(['/login']);
  }

  // Simple search using browser native find
  onSearch(event: Event): void {
    event.preventDefault();
    this.performSearch();
  }

  // Dynamic search as you type (with debounce)
  onSearchInput(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (this.searchQuery.length >= 2) {
        this.performSearchCSS(); // Only use CSS API for dynamic (no DOM changes)
      } else {
        this.clearHighlights();
      }
    }, 150);
  }

  performSearch(): void {
    // Clear previous highlights but keep query
    this.clearHighlights();

    if (!this.searchQuery || this.searchQuery.length < 2) {
      this.searchResultCount = 0;
      return;
    }

    // Use CSS Custom Highlight API if available, otherwise fallback to mark elements
    if ('Highlight' in window && CSS.highlights) {
      this.highlightWithCSS();
    } else {
      this.highlightWithMark();
    }
  }

  // CSS-only search for dynamic typing (doesn't modify DOM, so no focus loss)
  private performSearchCSS(): void {
    this.clearHighlights();

    if (!this.searchQuery || this.searchQuery.length < 2) {
      return;
    }

    if ('Highlight' in window && CSS.highlights) {
      this.highlightWithCSS();
    }
    // If CSS Highlight not available, don't do anything dynamic (wait for Enter)
  }

  private highlightWithCSS(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const ranges: Range[] = [];

    // Get text nodes in content area
    const content = document.getElementById('content');
    if (!content) return;

    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.textContent?.toLowerCase() || '';
      let startPos = 0;

      while (true) {
        const index = text.indexOf(query, startPos);
        if (index === -1) break;

        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + query.length);
        ranges.push(range);
        startPos = index + query.length;
      }
    }

    if (ranges.length > 0) {
      const highlight = new (window as any).Highlight(...ranges);
      CSS.highlights.set('search-highlight', highlight);
      this.searchResultCount = ranges.length;

      // Scroll to first match
      if (ranges[0]) {
        const rect = ranges[0].getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.top - 150,
          behavior: 'smooth'
        });
      }
    } else {
      this.searchResultCount = 0;
    }
  }

  private highlightWithMark(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const content = document.getElementById('content');
    if (!content) return;

    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const nodesToProcess: { node: Text; indices: number[] }[] = [];

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.textContent?.toLowerCase() || '';
      const indices: number[] = [];
      let startPos = 0;

      while (true) {
        const index = text.indexOf(query, startPos);
        if (index === -1) break;
        indices.push(index);
        startPos = index + query.length;
      }

      if (indices.length > 0) {
        nodesToProcess.push({ node, indices });
      }
    }

    let count = 0;
    nodesToProcess.forEach(({ node, indices }) => {
      const text = node.textContent || '';
      const parent = node.parentNode;
      if (!parent) return;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      indices.forEach(index => {
        // Add text before match
        if (index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)));
        }

        // Add highlighted match
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = text.substring(index, index + query.length);
        fragment.appendChild(mark);

        lastIndex = index + query.length;
        count++;
      });

      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      parent.replaceChild(fragment, node);
    });

    this.searchResultCount = count;

    // Scroll to first match
    const firstMark = document.querySelector('.search-highlight');
    if (firstMark) {
      firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Clear highlights only (keeps query)
  private clearHighlights(): void {
    this.searchResultCount = 0;

    // Clear CSS highlights
    if (CSS.highlights) {
      CSS.highlights.delete('search-highlight');
    }

    // Clear mark elements
    document.querySelectorAll('mark.search-highlight').forEach(mark => {
      const text = mark.textContent || '';
      mark.replaceWith(document.createTextNode(text));
    });
  }

  // Clear everything (query + highlights) - for X button
  clearSearch(): void {
    this.searchQuery = '';
    this.clearHighlights();
  }
}

