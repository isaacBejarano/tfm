import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Service } from '@angular/core';

import { UserPayloadLogin, UserPayloadSignup } from '@auth/models/dto-user.type';
import { StoreService } from '@shared/services/store.service';
import { WebService } from '@shared/services/web.service';
import { DtoId, DtoResponse } from '@shared/types/dto-response.type';
import { filter, map, Observable } from 'rxjs';

@Service()
export class AuthService {
  // DI
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _storeSrv = inject(StoreService);

  // SRV
  ////

  signup(payload: UserPayloadSignup | UserPayloadLogin): Observable<DtoResponse<Object>> {
    return this._http
      .post<DtoResponse<Object>>(this._webSrv.domain.api.get() + '/users', payload, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Created),
        map((res) => res.body),
        filter((body) => body !== null),
      );
  }

  login(payload: UserPayloadLogin): Observable<DtoResponse<DtoId>> {
    return this._http
      .post<DtoResponse<DtoId>>(this._webSrv.domain.api.get() + '/auth', payload, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        map((res) => res.body),
        filter((body) => body !== null),
      );
  }
}
