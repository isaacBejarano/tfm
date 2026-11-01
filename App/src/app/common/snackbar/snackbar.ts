import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { IconSnackbar } from '@app/common/snackbar/snackbar-icons.type';
import { SnackbarService } from '@app/common/snackbar/snackbar.service';

@Component({
  selector: 'app-snackbar',
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
    { initialValue: 'icon-info' },
  );
}
