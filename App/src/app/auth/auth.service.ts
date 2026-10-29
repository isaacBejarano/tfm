import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { filter, map, Observable, tap } from 'rxjs';

import { ResponseDto, UserDto } from '@app/shared/types/dto.type';
import { UserPayloadLogin, UserPayloadSignup } from '@app/user/user-model.type';
import { StoreService } from '@shared/services/store.service';
import { WebService } from '@shared/services/web.service';

@Service()
export class AuthService {
  // DI
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _storeSrv = inject(StoreService);

  // SRV
  ////

  signup(payload: UserPayloadSignup | UserPayloadLogin): Observable<Object> {
    return this._http
      .post<ResponseDto<Object>>(this._webSrv.domain.api.get() + '/users', payload, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Created),
        map((res) => res.body),
        filter((body) => body !== null),
        map((body) => body.items),
        tap(() => this._storeSrv.setState('formAuth', 'login')),
      );
  }

  login(payload: UserPayloadLogin): Observable<UserDto> {
    return this._http
      .post<ResponseDto<UserDto>>(this._webSrv.domain.api.get() + '/auth', payload, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        filter((res) => res.headers.get('Authorization') !== null),
        tap((res) => {
          const jwt = res.headers.get('Authorization')!;
          this._storeSrv.setState('accesToken', jwt);
        }),
        map((res) => res.body),
        filter((body) => body !== null),
        filter((dto) => dto.count === 1),
        map((res) => res.items[0]),
        tap((user) => {
          this._storeSrv.setState('loggedUser', user);
          this._storeSrv.setState('formAuth', '');
        }),
      );
  }
}
