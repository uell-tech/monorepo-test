import { Route } from '@angular/router';
export default [
  {
    path: 'cards',
    loadChildren: () => import('@emat/cards').then((m) => m.routes),
  },
  { path: '', redirectTo: '/cards', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./core/containers').then((x) => x.NotFoundPageComponent),
    data: { title: 'No encontrado' },
  },
] as Route[];
