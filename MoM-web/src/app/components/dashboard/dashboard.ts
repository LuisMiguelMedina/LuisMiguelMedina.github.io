import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

interface DashboardData {
  monthlyEarnings: number;
  annualEarnings: number;
  taskProgress: number;
  pendingRequests: number;
}

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
export class Dashboard implements OnInit {
  dashboardData: DashboardData = {
    monthlyEarnings: 40000,
    annualEarnings: 215000,
    taskProgress: 50,
    pendingRequests: 18
  };

  recentActivity: Activity[] = [
    {
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      description: 'A new monthly report is ready to download!'
    },
    {
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      description: '$290.29 has been deposited into your account!'
    },
    {
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      description: 'New user registration: john.doe@example.com'
    },
    {
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      description: 'Server maintenance completed successfully'
    }
  ];

  ngOnInit(): void {
    // Simulate loading dashboard data
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // In a real app, this would come from a service/API
    // For now, we'll just simulate some dynamic data
    setTimeout(() => {
      this.dashboardData = {
        ...this.dashboardData,
        monthlyEarnings: 40000 + Math.floor(Math.random() * 5000),
        taskProgress: 45 + Math.floor(Math.random() * 30)
      };
    }, 1000);
  }
}
