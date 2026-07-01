import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/services';
import { EXCLUDE_HEADERS_SKIP_LOADER } from '../../shared/components';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  const skipIfIcludesSome = ['/selectable'];
  const skipLoader =
    Boolean(req.headers.get(EXCLUDE_HEADERS_SKIP_LOADER)) ||
    skipIfIcludesSome.some(url => req.url.includes(url));
  if (skipLoader) {
    return next(req);
  }
  loader.show();

  return next(req).pipe(
    finalize(() => {
      loader.hideAfter(400);
    }),
  );
};
