import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoaderService } from '@common/loader/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const _loaderSrv = inject(LoaderService); // ctx
  _loaderSrv.load(true);
  return next(req).pipe(finalize(() => _loaderSrv.load(false))); // update laoder state
};
