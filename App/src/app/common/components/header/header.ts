import { Component, inject, input, signal } from '@angular/core';
import { Btn } from '@shared/components/btn/btn';
import { StoreService } from '@shared/services/store.service';
import { FormAuth } from '../../../shared/types/forms-auth.type';

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

  readonly legend = input.required<string>();

  // TODO: rouer + user claims
  readonly role = signal<'user' | 'admin' | 'super'>('user');
  readonly isLogged = signal<boolean>(false); // TODO: accessToken

  toggleAuthForms(state: FormAuth) {
    this._storeSrv.setState('formAuth', state);
  }
}
