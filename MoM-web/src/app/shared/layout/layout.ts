import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemoryMonitorComponent } from '../../components/memory-monitor/memory-monitor.component';

interface SessionUser {
  username: string;
  name: string;
  loginTime: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MemoryMonitorComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  currentUser: SessionUser | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    try {
      const stored = sessionStorage.getItem('mom_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  logout(): void {
    sessionStorage.removeItem('mom_user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
