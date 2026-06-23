import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';
import { Table } from './components/table/table';
import { Players } from './components/players/players';
import { Settings } from './components/settings/settings';
import { Layout } from './shared/layout/layout';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [loginGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'app',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'profile', component: Profile },
      { path: 'logs', component: Table },
      { path: 'monitoreo', component: Players },
      { 
        path: 'anuncios', 
        loadComponent: () => import('./components/anuncios/anuncios').then(m => m.Anuncios)
      },
      { 
        path: 'directorio', 
        loadComponent: () => import('./components/directorio/directorio').then(m => m.Directorio)
      },
      { 
        path: 'misiones', 
        loadComponent: () => import('./components/misiones/misiones').then(m => m.Misiones)
      },
      { 
        path: 'articulos', 
        loadComponent: () => import('./components/articulos/articulos').then(m => m.Articulos)
      },
      { path: 'settings', component: Settings }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
