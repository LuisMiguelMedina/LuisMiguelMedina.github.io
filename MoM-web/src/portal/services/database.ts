// Realtime Database service for the Multiverse of Madness portal.
// Ported from the legacy Angular DatabaseService (database.service.ts).
// Method names/shapes are preserved as plain exported functions plus a
// useDatabase() hook that reproduces the Angular auth-effect wiring.
import { useEffect, useState } from 'react';
import { ref, set, get, push, onValue, off } from 'firebase/database';
import { db } from '../firebase';
import { useAuth } from '../auth';
import type { AdminSession } from '../types';

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

// Minimal user shape consumed by syncUserProfile. In the legacy app this was
// the AuthService.currentUser() User; here we adapt from the portal AdminSession.
export interface DatabaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  createdAt: Date;
}

// Build a DatabaseUser from a portal AdminSession (username -> id/email parts).
function userFromSession(session: AdminSession): DatabaseUser {
  const [firstName, ...rest] = (session.name || session.username).split(' ');
  return {
    id: session.uuid || session.username,
    email: session.username,
    firstName: firstName || session.username,
    lastName: rest.join(' '),
    avatar: '',
    role: session.role,
    createdAt: new Date(),
  };
}

export async function syncUserProfile(user: DatabaseUser): Promise<UserProfile | null> {
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
      isOnline: true,
    };

    await set(ref(db, `users/${user.id}`), userProfileData);

    console.log('User profile synced to database');
    return userProfileData;
  } catch (error) {
    console.error('Error syncing user profile:', error);
    return null;
  }
}

export async function setUserOnline(uid: string, isOnline: boolean): Promise<void> {
  try {
    await set(ref(db, `users/${uid}/isOnline`), isOnline);
    await set(ref(db, `users/${uid}/lastSeen`), Date.now());
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
}

export async function loadDashboardData(): Promise<DashboardData | null> {
  try {
    const usersSnapshot = await get(ref(db, 'users'));
    const usersCount = usersSnapshot.exists()
      ? Object.keys(usersSnapshot.val()).length
      : 0;

    // Mock data for now - can be expanded to read from database.
    const mockDashboardData: DashboardData = {
      users: usersCount,
      sessions: Math.floor(Math.random() * 500) + 100,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      growth: Math.floor(Math.random() * 25) + 5,
    };

    return mockDashboardData;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return null;
  }
}

export async function saveUserActivity(
  userId: string,
  activity: Record<string, unknown>,
): Promise<void> {
  try {
    if (!userId) return;

    const activityData = {
      ...activity,
      userId,
      timestamp: Date.now(),
    };

    await push(ref(db, `activities/${userId}`), activityData);
  } catch (error) {
    console.error('Error saving user activity:', error);
  }
}

export async function getUserActivities(
  uid: string,
): Promise<Array<Record<string, unknown> & { id: string }>> {
  try {
    if (!uid) return [];

    const activitiesSnapshot = await get(ref(db, `activities/${uid}`));

    if (activitiesSnapshot.exists()) {
      const activities = activitiesSnapshot.val() as Record<string, Record<string, unknown>>;
      return Object.keys(activities).map((key) => ({
        id: key,
        ...activities[key],
      }));
    }

    return [];
  } catch (error) {
    console.error('Error getting user activities:', error);
    return [];
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersSnapshot = await get(ref(db, 'users'));

    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val() as Record<string, UserProfile>;
      return Object.values(users);
    }

    return [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Real-time listener for a specific user. Returns an unsubscribe function.
export function listenToUser(
  uid: string,
  callback: (user: UserProfile | null) => void,
): () => void {
  const userRef = ref(db, `users/${uid}`);

  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as UserProfile);
    } else {
      callback(null);
    }
  });

  return () => off(userRef);
}

export async function updateUserProfile(
  uid: string,
  current: UserProfile | null,
  updates: Partial<UserProfile>,
): Promise<void> {
  try {
    if (!uid) return;

    await set(ref(db, `users/${uid}`), {
      ...current,
      ...updates,
      lastUpdated: Date.now(),
    });

    console.log('User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}

export interface UseDatabaseResult {
  userProfile: UserProfile | null;
  dashboardData: DashboardData | null;
  onlineUsers: number;
}

// Hook port of the Angular DatabaseService reactive state. Replaces the
// constructor auth effect + online-users listener; cleans up on unmount.
export function useDatabase(): UseDatabaseResult {
  const { session } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

  // Online-users listener (memory-efficient: counts online flags only).
  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val() as Record<string, { isOnline?: boolean }>;
        let onlineCount = 0;
        for (const userId in users) {
          if (users[userId]?.isOnline) {
            onlineCount++;
          }
        }
        setOnlineUsers(onlineCount);
      } else {
        setOnlineUsers(0);
      }
    });
    return () => off(usersRef);
  }, []);

  // Auth-driven profile sync (port of the constructor effect).
  useEffect(() => {
    let cancelled = false;

    if (session) {
      const user = userFromSession(session);
      void syncUserProfile(user).then((profile) => {
        if (!cancelled) setUserProfile(profile);
      });
      void setUserOnline(user.id, true);
      void loadDashboardData().then((data) => {
        if (!cancelled) setDashboardData(data);
      });
    } else {
      setUserProfile((prev) => {
        if (prev) void setUserOnline(prev.uid, false);
        return null;
      });
    }

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { userProfile, dashboardData, onlineUsers };
}
