import { Component, inject, input, Signal } from '@angular/core';

import { Router } from '@angular/router';
import { AppPathFragments } from '@app/app.routes';
import { AuthFormType } from '@app/auth/auth-form/auth-form.type';
import { Btn } from '@shared/components/btn/btn';
import { Store, StoreService } from '@shared/services/store.service';

@Component({
  imports: [Btn],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  // I/O
  readonly legend = input.required<string>();

  // DI
  private readonly _storeSrv = inject(StoreService);
  private readonly _router = inject(Router);

  // CTRL
  ////

  protected readonly btnRose: string = Btn.style('rose', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-rose',
  ]);
  protected readonly btnGray: string = Btn.style('gray', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-gray',
  ]);
  protected readonly btnBlue: string = Btn.style('blue', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-blue',
  ]);
  protected readonly btnGreen: string = Btn.style('green', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-green',
  ]);

  readonly store: Signal<Store> = this._storeSrv.state;

  toggleAuthForms(state: AuthFormType) {
    this._storeSrv.setState('formAuth', state);
  }

  logout() {
    this._storeSrv.setState('accesToken', '');
    this._storeSrv.setState('userLogged', null);
    this._storeSrv.setState('formAuth', '');
    this._router.navigate(['']);
  }

  routeTo(path: AppPathFragments, id?: string): string {
    return id ? `${path}/${id}` : path;
  }

  clearHome() {
    this._storeSrv.setState('formAuth', '');
    this._router.navigate(['']);
  }
}
