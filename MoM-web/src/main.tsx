import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.scss';
import './portal/theme.scss';
import { PageTransition } from './components/PageTransition';
import { LumivoxHomePage } from './pages/LumivoxHomePage';
import { ArtistsPage } from './pages/ArtistsPage';
import { SamCommissionsPage } from './pages/SamCommissionsPage';
import { JozCommissionsPage } from './pages/JozCommissionsPage';
import { AuthProvider } from './portal/auth';
import { ProtectedRoute } from './portal/ProtectedRoute';
import { Layout } from './portal/Layout';
import { Login } from './portal/Login';
import { Register } from './portal/pages/Register';
import { Dashboard } from './portal/pages/Dashboard';
import { Profile } from './portal/pages/Profile';
import { Logs } from './portal/pages/Logs';
import { Players } from './portal/pages/Players';
import { Anuncios } from './portal/pages/Anuncios';
import { Directorio } from './portal/pages/Directorio';
import { Misiones } from './portal/pages/Misiones';
import { Articulos } from './portal/pages/Articulos';
import { Settings } from './portal/pages/Settings';

// Root layout: mounts the page-transition overlay above every route.
function RootLayout() {
  return (
    <>
      <PageTransition />
      <Outlet />
    </>
  );
}

// Route convention: /home/{artist}/{page}/{sub} — see docs/arc42 (ADR-0001).
// Luis.M's page is the Multiverse of Madness portal: a public login/register
// gate plus an auth-guarded app (pathless guard route keeps URLs flat).
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/home" replace /> },
      { path: '/home', element: <LumivoxHomePage /> },
      {
        path: '/home/luis-m/multiverse-of-madness',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: 'dashboard', element: <Dashboard /> },
              { path: 'profile', element: <Profile /> },
              { path: 'logs', element: <Logs /> },
              { path: 'monitoreo', element: <Players /> },
              { path: 'anuncios', element: <Anuncios /> },
              { path: 'directorio', element: <Directorio /> },
              { path: 'misiones', element: <Misiones /> },
              { path: 'articulos', element: <Articulos /> },
              { path: 'settings', element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '/artistas', element: <ArtistsPage /> },
  { path: '/artistas/:handle', element: <ArtistsPage /> },
  { path: '/home/sam/comisiones', element: <SamCommissionsPage /> },
  { path: '/home/joz/comisiones', element: <JozCommissionsPage /> },
      // Back-compat: old flat route -> canonical home/{artist}/{page}
      { path: '/multiverse-of-madness', element: <Navigate to="/home/luis-m/multiverse-of-madness" replace /> },
      { path: '*', element: <Navigate to="/home" replace /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
