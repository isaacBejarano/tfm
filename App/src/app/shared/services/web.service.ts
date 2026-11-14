import { Service } from '@angular/core';
import { env } from '@environments/environment';

@Service()
export class WebService {
  // SRV
  ////

  readonly API = {
    prefix: 'api',
    version: 'v1',
    get: () => `${env.domainAPI}/${this.API.prefix}/${this.API.version}`,
  };
}
