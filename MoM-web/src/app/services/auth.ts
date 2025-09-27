import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUserSignal = signal<User | null>(null);
  private isLoggedInSignal = signal<boolean>(false);

  // Public readonly signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = this.isLoggedInSignal.asReadonly();

  constructor() {
    // Check if user is already logged in from localStorage
    this.loadUserFromStorage();
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      // Simulate API call
      await this.delay(1000);

      // Mock user data for demo
      const mockUser: User = {
        id: '1',
        email: loginData.email,
        firstName: 'Douglas',
        lastName: 'McGee',
        avatar: 'assets/img/avatars/avatar1.jpeg',
        role: 'admin',
        createdAt: new Date(),
        lastLogin: new Date()
      };

      const authResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600
      };

      // Store user data
      this.setCurrentUser(mockUser);
      this.storeUserData(authResponse);

      return authResponse;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Simulate API call
      await this.delay(1000);

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Mock user creation
      const mockUser: User = {
        id: Date.now().toString(),
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        avatar: 'assets/img/avatars/avatar1.jpeg',
        role: 'user',
        createdAt: new Date()
      };

      const authResponse: AuthResponse = {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        expiresIn: 3600
      };

      this.setCurrentUser(mockUser);
      this.storeUserData(authResponse);

      return authResponse;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isLoggedInSignal.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  private setCurrentUser(user: User): void {
    this.currentUserSignal.set(user);
    this.isLoggedInSignal.set(true);
  }

  private storeUserData(authResponse: AuthResponse): void {
    localStorage.setItem('auth_token', authResponse.token);
    localStorage.setItem('current_user', JSON.stringify(authResponse.user));
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        this.setCurrentUser(user);
      } catch (error) {
        // Clear invalid data
        this.logout();
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
