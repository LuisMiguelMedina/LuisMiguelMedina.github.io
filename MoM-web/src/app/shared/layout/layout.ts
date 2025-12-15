import { Component, inject, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionsService } from '../../services/permissions.service';

interface SearchResult {
  element: HTMLElement;
  text: string;
  originalHTML: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements AfterViewInit {
  @ViewChild('pageContent') pageContent!: ElementRef<HTMLElement>;

  private router = inject(Router);
  permissionsService = inject(PermissionsService);

  // Señales reactivas del PermissionsService
  adminSession = this.permissionsService.adminSession;
  adminLevel = this.permissionsService.adminLevel;
  menuItems = computed(() => this.permissionsService.getMenuItems());

  // Search functionality
  searchQuery = '';
  searchResults: SearchResult[] = [];
  private highlightedElements: HTMLElement[] = [];

  ngAfterViewInit(): void {
    // Component initialized
  }

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

  // Search methods
  onSearch(event: Event): void {
    event.preventDefault();
    this.performSearch();
  }

  onSearchInput(): void {
    if (this.searchQuery.length >= 2) {
      this.performSearch();
    } else if (this.searchQuery.length === 0) {
      this.clearSearch();
    }
  }

  performSearch(): void {
    // Clear previous highlights
    this.clearHighlights();

    if (!this.searchQuery || this.searchQuery.length < 2) {
      this.searchResults = [];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    const container = this.pageContent?.nativeElement;

    if (!container) return;

    this.searchResults = [];

    // Find all text nodes with matching content
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.textContent?.toLowerCase() || '';
          if (text.includes(query) && node.parentElement) {
            // Exclude script, style, and input elements
            const tagName = node.parentElement.tagName.toLowerCase();
            if (['script', 'style', 'input', 'textarea'].includes(tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToHighlight: { node: Text; parent: HTMLElement }[] = [];

    while (walker.nextNode()) {
      const textNode = walker.currentNode as Text;
      if (textNode.parentElement) {
        nodesToHighlight.push({
          node: textNode,
          parent: textNode.parentElement
        });
      }
    }

    // Highlight matching text
    nodesToHighlight.forEach(({ node, parent }) => {
      const text = node.textContent || '';
      const lowerText = text.toLowerCase();
      const index = lowerText.indexOf(query);

      if (index >= 0) {
        // Create highlight span
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);

        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = match;

        const fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        fragment.appendChild(span);
        if (after) fragment.appendChild(document.createTextNode(after));

        parent.replaceChild(fragment, node);

        this.highlightedElements.push(span);
        this.searchResults.push({
          element: span,
          text: text.substring(Math.max(0, index - 20), Math.min(text.length, index + query.length + 20)),
          originalHTML: parent.innerHTML
        });
      }
    });

    // Scroll to first result
    if (this.highlightedElements.length > 0) {
      this.highlightedElements[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.clearHighlights();
  }

  private clearHighlights(): void {
    // Remove all highlight spans and restore original text
    document.querySelectorAll('.search-highlight').forEach(el => {
      const text = el.textContent || '';
      const textNode = document.createTextNode(text);
      el.parentNode?.replaceChild(textNode, el);
    });
    this.highlightedElements = [];
  }
}
