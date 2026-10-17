import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, filter, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const _progressbarSrv = inject(LoaderService); // DI
  _progressbarSrv.load(true);

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response),
    catchError((errorRes: HttpErrorResponse) => throwError(() => errorRes)),
    finalize(() => _progressbarSrv.load(false)),
  );
};
