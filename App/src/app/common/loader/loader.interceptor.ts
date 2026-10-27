import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '@common/loader/loader.service';
import { catchError, filter, finalize, throwError } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const _loaderSrv = inject(LoaderService); // DI
  _loaderSrv.load(true);

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response),
    catchError((errorRes: HttpErrorResponse) => throwError(() => errorRes)),
    finalize(() => _loaderSrv.load(false)), // updat laoder state
  );
};
