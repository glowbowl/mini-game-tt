import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'game',
  },
  {
    path: 'game',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
  },
];
