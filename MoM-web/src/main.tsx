import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
import { LumivoxHomePage } from './pages/LumivoxHomePage';
import { MultiverseOfMadnessPage } from './pages/MultiverseOfMadnessPage';

// Route convention: /home/{artist}/{page} — see docs/arc42 (ADR-0001).
const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },
  { path: '/home', element: <LumivoxHomePage /> },
  { path: '/home/luis-m/multiverse-of-madness', element: <MultiverseOfMadnessPage /> },
  // Back-compat: old flat route -> canonical home/{artist}/{page}
  { path: '/multiverse-of-madness', element: <Navigate to="/home/luis-m/multiverse-of-madness" replace /> },
  { path: '*', element: <Navigate to="/home" replace /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
