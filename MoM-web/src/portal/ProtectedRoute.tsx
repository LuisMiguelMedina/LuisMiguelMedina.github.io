import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth';
import { PORTAL_BASE } from './constants';

export function ProtectedRoute(): JSX.Element {
  const { session } = useAuth();

  if (session === null) {
    return <Navigate to={`${PORTAL_BASE}/login`} replace />;
  }

  return <Outlet />;
}
