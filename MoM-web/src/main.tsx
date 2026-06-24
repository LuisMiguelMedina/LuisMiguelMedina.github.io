import { StrictMode, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
import './portal/theme.scss';
import { PageTransition } from './components/PageTransition';
import { ThemeProvider } from './components/ThemeContext';
import { LanguageProvider } from './i18n';
import { LumivoxHomePage } from './pages/LumivoxHomePage';
import { ArtistsPage } from './pages/ArtistsPage';
import { SamCommissionsPage } from './pages/SamCommissionsPage';
import { JozCommissionsPage } from './pages/JozCommissionsPage';

// The Multiverse-of-Madness portal is lazy-loaded: it drags in Firebase + FontAwesome,
// which the public landing never touches. Splitting it keeps /home's first load lean.
const AuthProvider = lazy(() => import('./portal/auth').then((m) => ({ default: m.AuthProvider })));
const ProtectedRoute = lazy(() => import('./portal/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })));
const Layout = lazy(() => import('./portal/Layout').then((m) => ({ default: m.Layout })));
const Login = lazy(() => import('./portal/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./portal/pages/Register').then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import('./portal/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import('./portal/pages/Profile').then((m) => ({ default: m.Profile })));
const Logs = lazy(() => import('./portal/pages/Logs').then((m) => ({ default: m.Logs })));
const Players = lazy(() => import('./portal/pages/Players').then((m) => ({ default: m.Players })));
const Anuncios = lazy(() => import('./portal/pages/Anuncios').then((m) => ({ default: m.Anuncios })));
const Directorio = lazy(() => import('./portal/pages/Directorio').then((m) => ({ default: m.Directorio })));
const Misiones = lazy(() => import('./portal/pages/Misiones').then((m) => ({ default: m.Misiones })));
const Articulos = lazy(() => import('./portal/pages/Articulos').then((m) => ({ default: m.Articulos })));
const Settings = lazy(() => import('./portal/pages/Settings').then((m) => ({ default: m.Settings })));

// Root layout: page-transition overlay above every route; Suspense catches the
// lazy portal chunks (public routes are eager, so they never suspend here).
function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <PageTransition />
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </ThemeProvider>
    </LanguageProvider>
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
