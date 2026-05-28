import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
import { LuvinoxHomePage } from './pages/LuvinoxHomePage';
import { MultiverseOfMadnessPage } from './pages/MultiverseOfMadnessPage';

const router = createBrowserRouter([
  { path: '/', element: <LuvinoxHomePage /> },
  { path: '/multiverse-of-madness', element: <MultiverseOfMadnessPage /> },
  { path: '*', element: <LuvinoxHomePage /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
