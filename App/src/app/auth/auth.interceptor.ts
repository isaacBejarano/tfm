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

  return next(req).pipe(
    filter((e) => e.type === HttpEventType.Response),
    catchError((error: HttpErrorResponse) => {
      // Resend JWT only when API asks for it via header 'WWW-Authenticate'
      const isUnauthorized = error.status === HttpStatusCode.Unauthorized;
      const isChallenged =
        error.headers.has('WWW-Authenticate') && error.headers.get('WWW-Authenticate') === 'Bearer';

      // retry
      if (isUnauthorized && isChallenged && _token !== '') {
        req = req.clone({ headers: req.headers.set('Authorization', _token) });
        return next(req);
      }

      // TODO: Refresh Token management here too
      return throwError(() => error);
    }),
  );
};
