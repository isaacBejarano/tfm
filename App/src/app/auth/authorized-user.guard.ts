import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SnackbarService } from '@common/snackbar/snackbar.service';
import { StoreService } from '@shared/services/store.service';
import { UserRole } from '@user/user-model.type';

export const authUser: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _snackbarSrv = inject(SnackbarService);
  const _roles: UserRole[] = inject(StoreService).state().userLogged?.roles ?? [];
  const isRoleUser: boolean = _roles.every((role) => !['Admin', 'Super'].includes(role));

  if (!isRoleUser) {
    _router.navigate(['']);
    _snackbarSrv
      .setIcon('icon-warning')
      .setMsg('Sólo el rol "User" puede acceder a esta sección.')
      .notify()
      .during(4000);
  }

  return isRoleUser;
};
