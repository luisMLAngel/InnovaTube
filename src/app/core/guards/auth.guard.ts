import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthFacadeService } from '../../features/auth/services';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => {
  const authFacadeService = inject(AuthFacadeService);
  const router = inject(Router);
  const isAuthenticated = authFacadeService.isAuthenticated();

  if (!isAuthenticated) {
    await router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }, // Sirve para redirigir después de login
    });
    return false;
  }
  return true;
};
