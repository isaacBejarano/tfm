import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { StoreService } from '@shared/services/store.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string = inject(StoreService).state().accesToken;
  if (token !== '') req = req.clone({ headers: req.headers.set('Authorization', token) });
  return next(req).pipe(catchError((errorRes: HttpErrorResponse) => throwError(() => errorRes)));
};
