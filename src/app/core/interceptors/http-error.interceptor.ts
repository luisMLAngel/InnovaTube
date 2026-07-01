import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorFacadeService } from '../services';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorFacade = inject(HttpErrorFacadeService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorFacade.handle(error);
      return throwError(() => error);
    }),
  );
};
