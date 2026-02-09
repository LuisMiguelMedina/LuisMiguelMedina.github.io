import { Component, inject, computed, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../services/permissions.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private router = inject(Router);
  permissionsService = inject(PermissionsService);

  // Mobile sidebar state
  sidebarOpen = signal(false);

  // Señales reactivas del PermissionsService
  adminSession = this.permissionsService.adminSession;
  adminLevel = this.permissionsService.adminLevel;
  menuItems = computed(() => this.permissionsService.getMenuItems());

  // Helpers para el template
  getLevelName(): string {
    return this.permissionsService.getLevelName();
  }

  getLevelColor(): string {
    return this.permissionsService.getLevelColor();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  // Close sidebar on route change
  @HostListener('click', ['$event'])
  onNavClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.closest('.nav-link') && window.innerWidth < 768) {
      this.closeSidebar();
    }
  }

  logout(): void {
    this.permissionsService.clearSession();
    this.router.navigate(['/login']);
  }
}
