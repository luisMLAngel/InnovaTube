import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthFacadeService } from '../../features/auth/services';
import { environment } from '../../environments';
import { StorageService } from '../services';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export function AuthInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authFacade = inject(AuthFacadeService);
  const http = inject(HttpClient);
  const storage = inject(StorageService);

  const excludeUrls = ['/auth/login', '/users/register', '/auth/refresh-token'];
  const isExcluded = excludeUrls.some(url => req.url.includes(url));

  const accessToken = storage.getAccessToken();
  const authReq = accessToken && !isExcluded ? addTokenHeader(req, accessToken) : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !isExcluded) {
        return handle401Error(authReq, next, authFacade, http, storage);
      }
      return throwError(() => err);
    }),
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authFacade: AuthFacadeService,
  http: HttpClient,
  storage: StorageService,
): Observable<HttpEvent<any>> {
  const SERVER = environment.SERVER;

  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      authFacade.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return http.post<any>(`${SERVER}/auth/refresh-token`, { refreshToken }).pipe(
      switchMap(res => {
        isRefreshing = false;
        const { accessToken, refreshToken: newRefreshToken } = res;

        storage.setAccessToken(accessToken);
        storage.setRefreshToken(newRefreshToken);
        authFacade.setAccessToken(accessToken);

        refreshSubject.next(accessToken);
        return next(addTokenHeader(request, accessToken));
      }),
      catchError(err => {
        isRefreshing = false;
        storage.clear();
        authFacade.setAccessToken(null);
        authFacade.logout();
        return throwError(() => err);
      }),
    );
  }

  return refreshSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addTokenHeader(request, token!))),
  );
}
