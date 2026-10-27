import { Component, computed, inject, OnDestroy } from '@angular/core';

import { FormAuth } from '@app/auth/form-auth/form-auth';
import { AuthService } from '@auth/auth.service';
import { UserPayloadLogin, UserPayloadSignup } from '@auth/models/dto-user.type';
import { StoreService } from '@shared/services/store.service';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormAuth],
})
export class Home implements OnDestroy {
  // DI
  private readonly _storeSrv = inject(StoreService);
  private readonly _authSrv = inject(AuthService);

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
        map((dto) => dto.items[0].id),
        switchMap((userId) => {
          // TODO: switchMap call to endpoint "user/:id/agendas"
          // if DTO agenda [] -> SPA route to "agendas/new"
          // else if DTO agenda [Id:] -> SPA route to "agendas/:id"
          return of(userId);
          // return of(this._webSrv.navigateToDynamicRoute(`user/${id}/agenda`));
        }),
      )
      .subscribe(); // 1-time subscription
  }

  ngOnDestroy(): void {
    this._storeSrv.setState('formAuth', 'none');
  }
}

/*

### HTTPS only
@Api = https://localhost:7247/api/v1


### POST "/user" - TEST signup -> 201 Created
POST {{Api}}/user
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@12345",
  "name":"Kalush"
}

### POST "/user" - TEST signup -> 201 Created
POST {{Api}}/user
Content-Type: application/json

{
  "email":"Lovelace@yopmail.com",
  "password":"Love@12345"
  "name":"Lovelace"
}


### POST "/user" - TEST signup repeating -> 409 Conflict
POST {{Api}}/user
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@12345",
  "name":"Kalush"
}


### POST "/auth" - TEST "wrong email" -> 400 Bad Request
POST {{Api}}/auth
Content-Type: application/json

{
  "email":"Lovelace@yopmail.com",
  "password":"Ab@12345"
}


### POST "/auth" - TEST "wrong password" -> 400 Bad Request
POST {{Api}}/auth
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@00000"
}


### POST "/auth" - TEST login (right creds) -> 200 OK
POST {{Api}}/auth
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@12345"
}

### POST "/auth" - TEST login (right creds) -> 200 OK
POST {{Api}}/auth
Content-Type: application/json

{
  "email":"Lovelace@yopmail.com",
  "password":"Love@12345"
}
*/
