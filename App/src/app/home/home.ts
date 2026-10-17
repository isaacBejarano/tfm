import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';

import { DtoUser } from '@app/auth/types/dto-user.type';
import { FormAuth } from '@shared/components/form-auth/form-auth';
import { StoreService } from '@shared/services/store.service';
import { WebService } from '@shared/services/web.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [FormAuth],
})
export class Home implements OnDestroy {
  // DI
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _storeSrv = inject(StoreService);

  // CTRL
  ////

  readonly count = signal(0);
  readonly store = computed(() => this._storeSrv.state());

  protected signup(payload: DtoUser): void {
    // TODO: encapsulate into AuthSrv
    this._http
      .post(this._webSrv.domain.api.get() + '/user', payload)
      .pipe(switchMap(() => this._webSrv.navigateToDynamicRoute('login')))
      .subscribe(console.log); // 1-time subscription
  }

  protected login(payload: DtoUser): void {
    // TODO: encapsulate into AuthSrv
    this._http
      .post(this._webSrv.domain.api.get() + '/auth', payload)
      .pipe(switchMap(() => this._webSrv.navigateToDynamicRoute('user/:id/agenda')))
      .subscribe(console.log); // 1-time subscription
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










*/
