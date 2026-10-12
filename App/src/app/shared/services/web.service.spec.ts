import { TestBed } from '@angular/core/testing';
import { WebService } from '@shared/services/web.service';

describe('Api', () => {
  let service: WebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
