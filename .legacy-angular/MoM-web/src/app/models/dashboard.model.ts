export interface DashboardData {
  totalUsers: number;
  totalSales: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface TableData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: Date;
  lastActivity: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}
