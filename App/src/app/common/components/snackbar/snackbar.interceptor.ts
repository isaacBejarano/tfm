import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { DtoResponse } from '@app/shared/types/dto-response.type';
import { SnackbarService } from '@common/components/snackbar/snackbar.service';
import { catchError, filter, tap, throwError } from 'rxjs';

export const httpResponseMessageInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackbarSrv = inject(SnackbarService); // DI

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response),
    tap((res) => snackbarNotify(res, _snackbarSrv)),
    catchError((res: HttpErrorResponse) => {
      snackbarNotify(res, _snackbarSrv); // body dto
      return throwError(() => res.status); // header status code
    }),
  );
};

// AUX

const snackbarNotify = (
  res: HttpResponse<unknown> | HttpErrorResponse,
  snackbarSrv: SnackbarService,
) => {
  let dto = res.ok
    ? (res.body as DtoResponse<unknown>)
    : ((res as HttpErrorResponse).error as DtoResponse<unknown>);

  // update snackbar state
  snackbarSrv
    .setIcon(res.ok ? 'icon-check' : 'icon-warning')
    .setMsg(dto.msg)
    .notify()
    .during(3000); // builder TODO:
};

// TODO: add to DOCUMENTATIONthe "Result Type Pattern"
// https://en.wikipedia.org/wiki/Result_type
