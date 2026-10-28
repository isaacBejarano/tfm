import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SnackbarService } from '@common/snackbar/snackbar.service';
import { StoreService } from '@shared/services/store.service';
import { UserRole } from '@user/user-model.type';

export const authorizedAdminOrSuperGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _snackbarSrv = inject(SnackbarService);
  const roles: UserRole[] = inject(StoreService).state().loggedUser?.roles ?? [];

  const isRoleAdmin: boolean = roles.every((role) => !['User'].includes(role));

  if (!isRoleAdmin) {
    _router.navigate(['']);
    _snackbarSrv
      .setIcon('icon-warning')
      .setMsg('Sólo los roles "Admin" y "Super" pueden acceder a esta sección.')
      .notify()
      .during(4000);
  }

  return isRoleAdmin;
};

// FIXME: extract Roles from JWT (decrypted JS) instead than in DTO?
