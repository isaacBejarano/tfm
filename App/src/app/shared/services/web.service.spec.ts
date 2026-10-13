import { TestBed } from '@angular/core/testing';
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
    webSrv.domain.dev.host = 'someHost';
    webSrv.domain.dev.port = '1234';
    webSrv.domain.api.prefix = 'someApi';
    webSrv.domain.api.version = 'v2';
    expect(webSrv.domain.api.get()).toMatch('someHost:1234/someApi/v2');
  });
});
