import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, tap, throwError } from 'rxjs';

import { SnackbarService } from '@app/common/snackbar/snackbar.service';
import { DtoResponse } from '@app/shared/types/dto.type';

export const httpResponseMessageInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackbarSrv = inject(SnackbarService); // DI

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response),
    tap((response) => snackbarNotify(response, _snackbarSrv)),
    catchError((error: HttpErrorResponse) => {
      snackbarNotify(error, _snackbarSrv); // body dto
      return throwError(() => error);
    }),
  );
};

// AUX

const snackbarNotify = (
  res: HttpResponse<unknown> | HttpErrorResponse,
  snackbarSrv: SnackbarService,
) => {
  let msg: string = 'Error no gestionado.';

  if (res.ok) msg = (res.body as DtoResponse<unknown>).msg;
  else {
    const resError = res as HttpErrorResponse;
    msg = resError.error.msg ?? clientErrorMsg(resError.status);
  }

  // update snackbar state
  snackbarSrv
    .setIcon(res.ok ? 'icon-check' : 'icon-warning')
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
