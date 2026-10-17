import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';

@Service()
export class WebService {
  // DI
  private readonly _router = inject(Router);

  // SRV
  ////

  readonly domain = {
    dev: {
      host: 'https://localhost',
      port: '4200',
    },
    prod: {
      host: 'https://kuebello.netlify.app',
      port: '7247',
    },
    api: {
      prefix: 'api',
      version: 'v1',
      get: () =>
        `${this.domain.dev.host}:${this.domain.dev.port}/${this.domain.api.prefix}/${this.domain.api.version}`,
    },
  };

  navigateToDynamicRoute(route: string): Observable<boolean> {
    const fragments = route.split('/').filter((fragment) => fragment !== '');
    return from(this._router.navigate(fragments));
  }
}
