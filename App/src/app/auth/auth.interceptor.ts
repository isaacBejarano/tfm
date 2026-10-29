import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { StoreService } from '@shared/services/store.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _token: string = inject(StoreService).state().accesToken; // ctx
  if (_token !== '') req = req.clone({ headers: req.headers.set('Authorization', _token) });
  return next(req);
};
