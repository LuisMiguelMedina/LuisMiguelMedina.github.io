import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Simple session-based authentication guard.
 * Uses sessionStorage to check if user is logged in.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check for simple session
  const sessionUser = sessionStorage.getItem('mom_user');

  if (sessionUser) {
    try {
      const user = JSON.parse(sessionUser);
      if (user && user.username) {
        return true;
      }
    } catch (error) {
      console.error('Error parsing session:', error);
    }
  }

  router.navigate(['/login']);
  return false;
};

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Check if already logged in
  const sessionUser = sessionStorage.getItem('mom_user');

  if (sessionUser) {
    try {
      const user = JSON.parse(sessionUser);
      if (user && user.username) {
        router.navigate(['/app/dashboard']);
        return false;
      }
    } catch (error) {
      // Invalid session, allow access to login
    }
  }

  return true;
};
