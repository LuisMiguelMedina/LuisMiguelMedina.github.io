import { Injectable, inject, signal, effect, OnDestroy, DestroyRef } from '@angular/core';
import { Database, ref, set, get, push, onValue, off } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  createdAt: number;
  lastLogin: number;
  isOnline: boolean;
}

export interface DashboardData {
  users: number;
  sessions: number;
  revenue: number;
  growth: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService implements OnDestroy {
  private database = inject(Database);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  private authEffect: any;
  private usersListenerRef: any;

  private userProfileSignal = signal<UserProfile | null>(null);
  private dashboardDataSignal = signal<DashboardData | null>(null);
  private onlineUsersSignal = signal<number>(0);

  userProfile = this.userProfileSignal.asReadonly();
  dashboardData = this.dashboardDataSignal.asReadonly();
  onlineUsers = this.onlineUsersSignal.asReadonly();

  constructor() {
    // Use effect to listen for auth state changes with cleanup
    this.authEffect = effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.syncUserProfile(user);
        this.setUserOnline(user.id, true);
        this.loadDashboardData();
      } else {
        const currentProfile = this.userProfile();
        if (currentProfile) {
          this.setUserOnline(currentProfile.uid, false);
        }
        this.userProfileSignal.set(null);
      }
    });

    this.setupOnlineUsersListener();

    // Cleanup listeners on service destruction
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    // Clean up Firebase listeners
    if (this.usersListenerRef) {
      off(this.usersListenerRef);
    }

    // Clean up auth effect
    if (this.authEffect) {
      this.authEffect.destroy?.();
    }

    // Reset signals to free memory
    this.userProfileSignal.set(null);
    this.dashboardDataSignal.set(null);
    this.onlineUsersSignal.set(0);
  }

  async syncUserProfile(user: User): Promise<void> {
    try {
      const userProfileData: UserProfile = {
        uid: user.id,
        email: user.email,
        displayName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar || '',
        role: user.role,
        createdAt: user.createdAt.getTime(),
        lastLogin: Date.now(),
        isOnline: true
      };

      // Save to database
      await set(ref(this.database, `users/${user.id}`), userProfileData);

      // Update local state
      this.userProfileSignal.set(userProfileData);

      console.log('User profile synced to database');
    } catch (error) {
      console.error('Error syncing user profile:', error);
    }
  }

  async setUserOnline(uid: string, isOnline: boolean): Promise<void> {
    try {
      await set(ref(this.database, `users/${uid}/isOnline`), isOnline);
      await set(ref(this.database, `users/${uid}/lastSeen`), Date.now());
    } catch (error) {
      console.error('Error updating user online status:', error);
    }
  }

  private setupOnlineUsersListener(): void {
    this.usersListenerRef = ref(this.database, 'users');

    // Use more memory-efficient listener
    onValue(this.usersListenerRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        // Process only online status to reduce memory usage
        let onlineCount = 0;
        for (const userId in users) {
          if (users[userId]?.isOnline) {
            onlineCount++;
          }
        }
        this.onlineUsersSignal.set(onlineCount);
      } else {
        this.onlineUsersSignal.set(0);
      }
    });
  }

  async loadDashboardData(): Promise<void> {
    try {
      const usersSnapshot = await get(ref(this.database, 'users'));
      const usersCount = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;

      // Mock data for now - you can expand this to read from database
      const mockDashboardData: DashboardData = {
        users: usersCount,
        sessions: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 10000) + 5000,
        growth: Math.floor(Math.random() * 25) + 5
      };

      this.dashboardDataSignal.set(mockDashboardData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async saveUserActivity(activity: any): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      const activityData = {
        ...activity,
        userId: user.id,
        timestamp: Date.now()
      };

      await push(ref(this.database, `activities/${user.id}`), activityData);
    } catch (error) {
      console.error('Error saving user activity:', error);
    }
  }

  async getUserActivities(uid?: string): Promise<any[]> {
    try {
      const userId = uid || this.authService.getCurrentUser()?.id;
      if (!userId) return [];

      const activitiesSnapshot = await get(ref(this.database, `activities/${userId}`));

      if (activitiesSnapshot.exists()) {
        const activities = activitiesSnapshot.val();
        return Object.keys(activities).map(key => ({
          id: key,
          ...activities[key]
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting user activities:', error);
      return [];
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const usersSnapshot = await get(ref(this.database, 'users'));

      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        return Object.values(users) as UserProfile[];
      }

      return [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Real-time listener for specific user data
  listenToUser(uid: string, callback: (user: UserProfile | null) => void): () => void {
    const userRef = ref(this.database, `users/${uid}`);

    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as UserProfile);
      } else {
        callback(null);
      }
    });

    // Return unsubscribe function
    return () => off(userRef);
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      await set(ref(this.database, `users/${user.id}`), {
        ...this.userProfile(),
        ...updates,
        lastUpdated: Date.now()
      });

      console.log('User profile updated');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }
}
