import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { EMPTY, filter, map, Observable, of } from 'rxjs';

import { ResponseDto, UserDto, UserPatch } from '@app/shared/types/dto.type';
import { checkGuidv7 } from '@app/shared/utils/params.util';
import { Store, StoreService } from '@shared/services/store.service';
import { WebService } from '@shared/services/web.service';

@Service()
export class UserService {
  // DI
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _storeSrv = inject(StoreService);

  // SRV
  ////

  private readonly _store: Signal<Store> = this._storeSrv.state;

  profileRead(id: string): never | Observable<UserDto> {
    checkGuidv7(id);

    return this._http
      .get<ResponseDto<UserDto>>(this._webSrv.domain.api.get() + `/users/${id}`, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        map((res) => res.body),
        filter((dto) => dto !== null),
        filter((dto) => dto.count === 1),
        map((dto) => dto.items[0]),
      );
  }

  profileUpdate(id: string, patch: UserPatch): never | Observable<UserDto> {
    checkGuidv7(id);

    const dto: UserDto = {
      id: '[]',
      agendaIds: [],
      email: '[]',
      name: '[]',
      roles: [],
    };
    return of(dto); // FIXME:

    // return this._http
    //   .post<ResponseDto<Object>>(this._webSrv.domain.api.get() + '/users', payload, {
    //     responseType: 'json',
    //     observe: 'response',
    //   })
    //   .pipe(
    //     filter((res) => res.status === HttpStatusCode.Created),
    //     map((res) => res.body),
    //     filter((body) => body !== null),
    //     map((body) => body.items),
    //     tap(() => this._storeSrv.setState('formAuth', 'login')),
    //   );
  }

  profileDelete(id: string): never | Observable<Object> {
    checkGuidv7(id);

    // cancel deletion
    if (!confirm(`Eliminar a ${this._store().userProfile?.name ?? 'este usuario'}?`)) return EMPTY; // TODO: turn PROMPT into nice Confirmation Modal

    return this._http
      .delete<ResponseDto<Object>>(this._webSrv.domain.api.get() + `/users/${id}`, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        map((res) => res.body),
        filter((dto) => dto !== null),
        filter((dto) => dto.count === 0), // was deleted
      );
  }
}
