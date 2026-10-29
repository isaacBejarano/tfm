import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, filter, tap } from 'rxjs';

import { SnackbarService } from '@app/common/snackbar/snackbar.service';
import { DtoResponse } from '../../shared/types/dto.type';

export const httpResponseMessageInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackbarSrv = inject(SnackbarService); // DI

  return next(req).pipe(
    filter(
      (res): res is HttpResponse<DtoResponse<unknown>> =>
        res.type === HttpEventType.Response && res.ok && res.body !== null,
    ),
    tap((res) => snackbarNotify(res.body?.msg ?? 'Error.', res.ok, _snackbarSrv)), // never map middleware http res flow. Use tap for side fx!
    catchError((error: HttpErrorResponse) => {
      let msg: string = error?.error?.msg ?? clientErrorMsg(error.status);
      snackbarNotify(msg, error.ok, _snackbarSrv);
      return EMPTY;
    }),
  );
};

// AUX

const snackbarNotify = (msg: string, isOk: boolean, snackbarSrv: SnackbarService) => {
  snackbarSrv
    .setIcon(isOk ? 'icon-check' : 'icon-warning')
    .setMsg(msg)
    .notify()
    .during(4000);
};

const clientErrorMsg = (status: unknown): string => {
  return status === HttpStatusCode.BadGateway
    ? `Error ${status}: Puerta de enlace no válida. La API podría estar desconectada.`
    : 'Error no gestionado.';
  // other uncatched HttpStatusCode switch cases here...
};
