import { Service } from '@angular/core';

@Service()
export class WebService {
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
}
