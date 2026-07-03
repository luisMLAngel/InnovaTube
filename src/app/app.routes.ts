import { Routes } from '@angular/router';
import { AuthTemplate } from './core/templates';
import { AppTemplate } from './core/templates';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthTemplate,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.page').then(m => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register.page').then(m => m.RegisterPage),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/pages/reset-password/reset-password.page').then(
            m => m.ResetPasswordPage,
          ),
      },
    ],
  },
  {
    path: 'videos',
    component: AppTemplate,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/videos/pages/videos.page').then(m => m.VideosPage),
        data: { navId: 'main' },
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/videos/pages/favorite-videos.page').then(m => m.FavoriteVideosPage),
        data: { navId: 'main' },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/videos/pages/video-detail/video-detail.page').then(
            m => m.VideoDetailPage,
          ),
        data: { navId: 'main' },
      },
    ],
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/shared/pages/not-found/not-found.page').then(m => m.NotFoundPage),
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
