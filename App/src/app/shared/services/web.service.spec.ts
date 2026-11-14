import { TestBed } from '@angular/core/testing';
import { env } from '@environments/environment';
import { WebService } from '@shared/services/web.service';

describe('Api', () => {
  let webSrv: WebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    webSrv = TestBed.inject(WebService);
  });

  it('should be created', () => {
    expect(webSrv).toBeTruthy();
  });

  it('should return a computed API string', () => {
    webSrv.API.prefix = 'someApi';
    webSrv.API.version = 'v2';
    expect(webSrv.API.get()).toMatch(`${env.domainAPI}/someApi/v2`);
  });
});
