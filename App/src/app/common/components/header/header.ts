import { Component, computed, inject, input, signal } from '@angular/core';

import { FormType } from '@app/auth/types/form.type';
import { UserRole } from '@auth/models/dto-user.type';
import { Btn } from '@shared/components/btn/btn';
import { StoreService } from '@shared/services/store.service';
import { WebService } from '@shared/services/web.service';

@Component({
  imports: [Btn],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  // DI
  private readonly _storeSrv = inject(StoreService);
  private readonly _webSrv = inject(WebService);

  // CTRL
  ////

  // I/O
  readonly legend = input.required<string>();

  readonly btnRose: string = Btn.style('rose', 'outline', 'normal', ['raise', 'fade', '3d-rose']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', 'fade', '3d-gray']);
  readonly btnBlue: string = Btn.style('blue', 'outline', 'normal', ['raise', 'fade', '3d-blue']);

  // TODO: rouer + user claims
  readonly role = signal<UserRole>('User');

  // TODO: accessToken
  readonly isLogged = computed(() => this._storeSrv.state().accesToken?.length > 0);

  toggleAuthForms(state: FormType) {
    this._storeSrv.setState('formAuth', state);
  }

  logout() {
    this._storeSrv.setState('formAuth', 'none');
    this._storeSrv.setState('accesToken', '');
    this._webSrv.navigateToDynamicRoute('/');
  }
}
