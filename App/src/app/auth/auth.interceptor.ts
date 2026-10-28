import {
  HttpErrorResponse,
  HttpEventType,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { StoreService } from '@shared/services/store.service';
import { catchError, filter, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _token: string = inject(StoreService).state().accesToken;

  let clonedReq = req;
  if (_token !== '') clonedReq = req.clone({ headers: req.headers.set('Authorization', _token) });

  return next(clonedReq).pipe(
    filter((e) => e.type === HttpEventType.Response),
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === HttpStatusCode.Unauthorized;
      const isChallenged =
        error.headers.has('WWW-Authenticate') && error.headers.get('WWW-Authenticate') === 'Bearer';

      // Resend JWT when API asks for it via header 'WWW-Authenticate' when "session" expired
      if (isUnauthorized && isChallenged && _token !== '') {
        // TODO: get a new JWT calling to "Refresh Token" endpoint
        const _clonedReq = req.clone({ headers: req.headers.set('Authorization', _token) });
        return next(_clonedReq);
      }

      return throwError(() => error);
    }),
  );
};
