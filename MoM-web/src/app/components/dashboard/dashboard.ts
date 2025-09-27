import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

interface Activity {
  timestamp: Date;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  private databaseService = inject(DatabaseService);
  private authService = inject(AuthService);

  // Access real-time database signals
  dashboardData = this.databaseService.dashboardData;
  userProfile = this.databaseService.userProfile;
  onlineUsers = this.databaseService.onlineUsers;
  currentUser = this.authService.currentUser;

  // Lazy-loaded activity data to reduce initial memory usage
  private _recentActivity: Activity[] | null = null;

  get recentActivity(): Activity[] {
    if (!this._recentActivity) {
      this._recentActivity = [
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          description: 'A new monthly report is ready to download!'
        },
        {
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          description: '$290.29 has been deposited into your account!'
        },
        {
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          description: 'New user registration: john.doe@example.com'
        },
        {
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          description: 'Server maintenance completed successfully'
        }
      ];
    }
    return this._recentActivity;
  }

  ngOnInit(): void {
    // Database service automatically loads data when user is authenticated
    // Save user activity (optimized - only save once per session)
    if (!sessionStorage.getItem('dashboard_visited')) {
      this.databaseService.saveUserActivity({
        action: 'viewed_dashboard',
        page: '/app/dashboard'
      });
      sessionStorage.setItem('dashboard_visited', 'true');
    }
  }

  ngOnDestroy(): void {
    // Clear activity data to free memory
    this._recentActivity = null;
  }
}
