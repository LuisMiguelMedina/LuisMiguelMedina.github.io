import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MemoryMonitorComponent } from '../../components/memory-monitor/memory-monitor.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MemoryMonitorComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  constructor(private authService: AuthService) {}

  async logout() {
    await this.authService.logout();
    // Navigation is handled by the auth service
  }
}
