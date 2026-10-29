import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { StoreService } from '@shared/services/store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _token: string = inject(StoreService).state().accesToken;

  let clonedReq = req;
  if (_token !== '') clonedReq = req.clone({ headers: req.headers.set('Authorization', _token) });

  return next(clonedReq).pipe(
    // TODO: get a new JWT calling to "Refresh Token" endpoint when Acces Token expires
    // catchError((error: HttpErrorResponse) => {
    //   if (error.headers) {
    //     const isUnauthorized = error.status === HttpStatusCode.Unauthorized;
    //     const isChallenged =
    //       error.headers.has('WWW-Authenticate') &&
    //       error.headers.get('WWW-Authenticate') === 'Bearer';
    //     // Resend JWT when API asks for it via header 'WWW-Authenticate' when "session" expired
    //     if (isUnauthorized && isChallenged && _token !== '') {
    //       // const _clonedReq = req.clone({ headers: req.headers.set('Authorization', _token) });
    //       // return next(_clonedReq);
    //     }
    //   }
    //   return throwError(() => error);
    // }),
  );
};
