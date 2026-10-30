import { Component, computed, inject, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AuthForm } from '@app/auth/auth-form/auth-form';
import { UserPayloadLogin, UserPayloadSignup } from '@app/user/user-model.type';
import { AuthService } from '@auth/auth.service';
import { StoreService } from '@shared/services/store.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [AuthForm],
})
export class Home implements OnDestroy {
  // DI
  private readonly _storeSrv = inject(StoreService);
  private readonly _authSrv = inject(AuthService);
  private readonly _router = inject(Router);

  // CTRL
  ////

  readonly store = computed(() => this._storeSrv.state());

  protected signup(payload: UserPayloadSignup | UserPayloadLogin): void {
    this._authSrv.signup(payload).subscribe(); // 1-time subscription
  }

  protected login(payload: UserPayloadLogin): void {
    this._authSrv
      .login(payload)
      .pipe(
        tap((user) => {
          user.roles.every((role) => role !== 'User')
            ? this._router.navigate(['users']) // admin, super
            : user.agendaIds.length === 0 ||
                user.agendaIds.includes('00000000-0000-0000-0000-000000000000') // user
              ? this._router.navigate(['agendas', 'new'])
              : this._router.navigate(['agendas', user.agendaIds[0]]);
        }),
      )
      .subscribe(); // 1-time subscription
  }

  ngOnDestroy(): void {
    this._storeSrv.setState('formAuth', '');
  }
}
