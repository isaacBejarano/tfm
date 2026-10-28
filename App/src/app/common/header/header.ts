import { Component, computed, inject, input } from '@angular/core';

import { Router } from '@angular/router';
import { AppPathFragments } from '@app/app.routes';
import { FormType } from '@app/auth/types/form.type';
import { Btn } from '@shared/components/btn/btn';
import { StoreService } from '@shared/services/store.service';
import { DtoUser } from '../../shared/types/dto.type';

@Component({
  imports: [Btn],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  // DI
  private readonly _storeSrv = inject(StoreService);
  private readonly _router = inject(Router);

  // CTRL
  ////

  // I/O
  readonly legend = input.required<string>();

  readonly btnRose: string = Btn.style('rose', 'outline', 'normal', ['raise', 'fade', '3d-rose']);
  readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', 'fade', '3d-gray']);
  readonly btnBlue: string = Btn.style('blue', 'outline', 'normal', ['raise', 'fade', '3d-blue']);
  readonly btnGreen: string = Btn.style('green', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-green',
  ]);

  readonly loggedUser = computed<DtoUser | null>(() => this._storeSrv.state().loggedUser);

  toggleAuthForms(state: FormType) {
    this._storeSrv.setState('formAuth', state);
  }

  logout() {
    this._storeSrv.setState('accesToken', '');
    this._storeSrv.setState('loggedUser', null);
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
