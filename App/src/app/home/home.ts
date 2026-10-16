import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { WebService } from '../shared/services/web.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  // DI
  // private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);

  // CTRL
  ////

  readonly count = signal(0);
  readonly smoked = toSignal(
    // this._http.get<DtoResponse<DtoId>>(this._webSrv.domain.api.get() + '/smoke/full').pipe(
    //   filter((dto) => dto.count > 0),
    //   tap((dto) => this.count.set(dto.count)),
    //   map((dto) => dto.items),
    // ),
    of(['']),
    { initialValue: [] },
  );
}

// REGEXP PASS -> ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./])[0-9a-zA-Z`~!@#$%^&*()_+\-={}|[\]\\:"";'<>?,./]+$
// REGEXP EMAIL -> ^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$

/* TODO:

### HTTPS only
@Api = https://localhost:7247/api/v1

### SMOKE TEST 1 -> 200 OK
GET {{Api}}/smoke/almost
Content-Type: application/json


### POST "/user" - TEST creation repeats (all fields) -> 409 Conflict
POST {{Api}}/user
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@12345",
  "name":"Kalush"
}


### POST "/auth" - TEST login (right password & acces token) -> 200 OK
POST {{Api}}/auth
Content-Type: application/json

{
  "email":"Kalush@yopmail.com",
  "password":"Ab@12345"
}










*/
