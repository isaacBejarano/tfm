import { Component, inject, input, signal } from '@angular/core';

import { FormType } from '@app/auth/types/form.type';
import { StoreService } from '@shared/services/store.service';
import { Btn } from '../../../shared/components/btn/btn';

@Component({
  imports: [Btn],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  // DI
  private readonly _storeSrv = inject(StoreService);

  // CTRL
  ////

  // I/O
  readonly legend = input.required<string>();

  readonly btnRose: string = Btn.style('rose', 'outline', 'normal', ['raise', 'fade']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', 'fade']);
  readonly btnBlue: string = Btn.style('blue', 'outline', 'normal', ['raise', 'fade']);

  // TODO: rouer + user claims
  readonly role = signal<'user' | 'admin' | 'super'>('user');
  readonly isLogged = signal<boolean>(false); // TODO: accessToken

  toggleAuthForms(state: FormType) {
    this._storeSrv.setState('formAuth', state);
  }
}
