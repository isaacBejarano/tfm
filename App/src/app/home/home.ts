import { Component, computed, inject, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { FormAuth } from '@app/auth/form-auth/form-auth';
import { UserPayloadLogin, UserPayloadSignup } from '@app/user/user-model.type';
import { AuthService } from '@auth/auth.service';
import { StoreService } from '@shared/services/store.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormAuth],
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
        switchMap((user) => {
          // TODO: switchMap call to endpoint API "users/:id" <- dto has agendas []
          // if DTO agenda [] -> SPA route to "agendas/new"
          // else if DTO agenda [Id:] -> SPA route to "agendas/:id"

          const agendaID: string = Math.random() + user.id; // TODO:
          return of(this._router.navigate(['agendas', agendaID]));
        }),
      )
      .subscribe(); // 1-time subscription
  }

  ngOnDestroy(): void {
    this._storeSrv.setState('formAuth', '');
  }
}
