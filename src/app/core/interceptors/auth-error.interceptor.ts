import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthFacadeService } from '../../features/auth/services';

const EXCLUDE_PATHS: string[] = [
  '/auth/login',
  '/auth/user-organization',
  '/auth/register',
  '/auth/organization',
];

export function AuthErrorInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const authFacade = inject(AuthFacadeService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const currentPath = location.pathname;
      const isPublicRoute = EXCLUDE_PATHS.some(path => currentPath.includes(path));
      if (error.status === 409 && !isPublicRoute) {
        console.log('Unauthorized request - logging out');
        authFacade.logout();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    }),
  );
}
