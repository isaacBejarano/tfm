import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, filter, tap } from 'rxjs';

import { SnackbarService } from '@app/common/snackbar/snackbar.service';

export const httpResponseMessageInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackbarSrv = inject(SnackbarService); // DI

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response && e.ok),
    tap((res) => {
      console.log(res);
      // TODO: snackbarNotify((res.body as DtoResponse<unknown>).msg, res.ok, _snackbarSrv);
    }),
    catchError((error: HttpErrorResponse) => {
      let msg: string = error?.error?.msg ?? clientErrorMsg(error.status);
      snackbarNotify(msg, error.ok, _snackbarSrv); // body dto
      // return throwError(() => 'error'); // TODO: throw or SNACK clientErrorMsg?
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

// AUX

const clientErrorMsg = (status: unknown): string => {
  return status === HttpStatusCode.BadGateway
    ? `Error ${status}: Puerta de enlace no válida. La API podría estar desconectada.`
    : 'Error no gestionado.';
};
