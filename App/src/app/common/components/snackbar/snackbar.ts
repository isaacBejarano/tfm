import { Component, input } from '@angular/core';

import { Btn } from '@shared/components/btn/btn';
import { SnackIcons } from '@shared/types/icons';

@Component({
  imports: [Btn],
  selector: 'app-snack',
  templateUrl: './snackbar.html',
})
export class Snackbar {
  // DUMMY
  readonly msg = input.required<string>();
  readonly open = input.required<boolean>();
  readonly snackbarIcon = input.required<SnackIcons>();

  close() {
    console.log('closing snackbar...');
  }
}
