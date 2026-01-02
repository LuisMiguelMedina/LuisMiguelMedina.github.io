import { Component, inject, computed } from '@angular/core';
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

  logout(): void {
    this.permissionsService.clearSession();
    this.router.navigate(['/login']);
  }
}
