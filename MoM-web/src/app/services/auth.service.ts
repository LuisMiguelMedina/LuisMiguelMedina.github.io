import { Injectable, signal, inject, OnDestroy, DestroyRef } from '@angular/core';
import {
  Auth as FirebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private firebaseAuth = inject(FirebaseAuth);
  private router = inject(Router);
  private cacheService = inject(CacheService);
  private destroyRef = inject(DestroyRef);

  // Unsubscribe function for auth state
  private authStateUnsubscribe: (() => void) | null = null;

  private currentUserSignal = signal<User | null>(null);
  private isLoggedInSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);

  // Public readonly signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = this.isLoggedInSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  constructor() {
    // Listen to Firebase auth state changes with cleanup
    this.authStateUnsubscribe = onAuthStateChanged(this.firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        // Check cache first to avoid redundant object creation
        const cacheKey = `user_${firebaseUser.uid}`;
        let user = this.cacheService.get<User>(cacheKey);

        if (!user) {
          user = this.mapFirebaseUserToUser(firebaseUser);
          this.cacheService.set(cacheKey, user, 300000); // Cache for 5 minutes
        }

        this.currentUserSignal.set(user);
        this.isLoggedInSignal.set(true);
      } else {
        this.currentUserSignal.set(null);
        this.isLoggedInSignal.set(false);
      }
    });

    // Setup cleanup on service destruction
    this.destroyRef.onDestroy(() => {
      this.ngOnDestroy();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from auth state changes
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
      this.authStateUnsubscribe = null;
    }

    // Clear signals
    this.currentUserSignal.set(null);
    this.isLoggedInSignal.set(false);
    this.loadingSignal.set(false);
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      this.loadingSignal.set(true);

      const credential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        loginData.email,
        loginData.password
      );

      const user = this.mapFirebaseUserToUser(credential.user);
      const token = await credential.user.getIdToken();

      this.currentUserSignal.set(user);
      this.isLoggedInSignal.set(true);

      // Redirect to dashboard after successful login
      this.router.navigate(['/app/dashboard']);

      return {
        user,
        token,
        expiresIn: 3600,
        success: true,
        message: 'Login exitoso'
      };

    } catch (error: any) {
      this.isLoggedInSignal.set(false);

      // Handle Firebase auth errors
      let errorMessage = 'Error de autenticación';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = error.message || 'Error desconocido';
      }

      return {
        user: null,
        token: '',
        expiresIn: 0,
        success: false,
        message: errorMessage
      };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      this.loadingSignal.set(true);

      const credential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        registerData.email,
        registerData.password
      );

      // Update user profile with display name
      await updateProfile(credential.user, {
        displayName: `${registerData.firstName} ${registerData.lastName}`
      });

      const user = this.mapFirebaseUserToUser(credential.user);
      user.firstName = registerData.firstName;
      user.lastName = registerData.lastName;

      const token = await credential.user.getIdToken();

      this.currentUserSignal.set(user);
      this.isLoggedInSignal.set(true);

      // Redirect to dashboard after successful registration
      this.router.navigate(['/app/dashboard']);

      return {
        user,
        token,
        expiresIn: 3600,
        success: true,
        message: 'Registro exitoso'
      };

    } catch (error: any) {
      this.isLoggedInSignal.set(false);

      let errorMessage = 'Error en el registro';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El email ya está registrado';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión';
          break;
        default:
          errorMessage = error.message || 'Error desconocido';
      }

      return {
        user: null,
        token: '',
        expiresIn: 0,
        success: false,
        message: errorMessage
      };
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.currentUserSignal.set(null);
      this.isLoggedInSignal.set(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    const displayName = firebaseUser.displayName || '';
    const nameParts = displayName.split(' ');

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      firstName: nameParts[0] || 'Usuario',
      lastName: nameParts.slice(1).join(' ') || '',
      avatar: firebaseUser.photoURL || 'assets/img/avatars/avatar1.jpeg',
      role: 'user', // Default role
      createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
      lastLogin: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : new Date()
    };
  }

  // Utility methods for backward compatibility
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  async getToken(): Promise<string | null> {
    const user = this.firebaseAuth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}
