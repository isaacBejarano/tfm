import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SnackbarService } from '@common/components/snackbar/snackbar.service';
import { IconSnackbar } from '@shared/types/icons';

@Component({
  selector: 'app-snack',
  templateUrl: './snackbar.html',
})
export class Snackbar {
  // DI
  readonly _snackbarSrv = inject(SnackbarService);

  // CTRL
  ////

  readonly msg = toSignal<string, string>(
    this._snackbarSrv.msg$(), // unsubscribed by toSignal
    { initialValue: '' },
  );

  readonly icon = toSignal<IconSnackbar, IconSnackbar>(
    this._snackbarSrv.icon$(), // unsubscribed by toSignal
    { initialValue: 'icon-check' },
  );
}
