import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SnackbarService } from '@common/snackbar/snackbar.service';
import { StoreService } from '@shared/services/store.service';
import { UserRole } from '@user/user-model.type';

export const authAdminAndSuper: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _snackbarSrv = inject(SnackbarService);
  const _roles: UserRole[] = inject(StoreService).state().userLogged?.roles ?? [];
  const isRoleAdminOrSuper: boolean = _roles.every((role) => !['User'].includes(role));

  if (!isRoleAdminOrSuper) {
    _router.navigate(['']);
    _snackbarSrv
      .setIcon('icon-warning')
      .setMsg('Sólo los roles "Admin" y "Super" pueden acceder a esta sección.')
      .notify()
      .during(4000);
  }

  return isRoleAdminOrSuper;
};
