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

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export function AuthInterceptorFn(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authFacade = inject(AuthFacadeService);
  const http = inject(HttpClient);

  const excludeUrls = ['/auth/login', '/users/register', '/auth/refresh-token'];

  const isExcluded = excludeUrls.some(url => req.url.includes(url));

  const accessToken = authFacade.getAccessToken();
  const authReq = accessToken && !isExcluded ? addTokenHeader(req, accessToken) : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401 && !isExcluded) {
        return handle401Error(authReq, next, authFacade, http);
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
    withCredentials: true,
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authFacade: AuthFacadeService,
  http: HttpClient,
): Observable<HttpEvent<any>> {
  const SERVER = environment.SERVER;
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject.next(null);

    return http.post<any>(`${SERVER}/auth/refresh-token`, null, { withCredentials: true }).pipe(
      switchMap(res => {
        isRefreshing = false;
        const token = res.accessToken;
        authFacade.setAccessToken(token);
        refreshSubject.next(token);
        return next(addTokenHeader(request, token));
      }),
      catchError(err => {
        isRefreshing = false;
        authFacade.setAccessToken(null);
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
