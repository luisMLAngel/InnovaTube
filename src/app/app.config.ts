import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { AuthErrorInterceptorFn, AuthInterceptorFn, loaderInterceptor } from './core/interceptors';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '[data-theme="dark"]',
          cssLayer: {
            name: 'primeng',
            order: 'reset-base, tailwind-base, primeng, tailwind-utilities',
          },
        },
      },
    }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      }),
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        AuthInterceptorFn,
        AuthErrorInterceptorFn,
        // httpErrorInterceptor,
        loaderInterceptor,
      ]),
    ),
  ],
};
