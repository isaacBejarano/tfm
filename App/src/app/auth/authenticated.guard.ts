import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SnackbarService } from '@common/snackbar/snackbar.service';
import { StoreService } from '@shared/services/store.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const _token: string = inject(StoreService).state().accesToken;
  const _router = inject(Router);
  const _snackbarSrv = inject(SnackbarService);

  const isAuthenticated: boolean = _token !== '';

  if (!isAuthenticated) {
    _router.navigate(['']);
    _snackbarSrv
      .setIcon('icon-warning')
      .setMsg('El usuario debe estar autenticado para acceder a esta sección.')
      .notify()
      .during(4000);
  }

  return isAuthenticated;
};
