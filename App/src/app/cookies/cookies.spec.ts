import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Cookies } from './cookies';

describe('RGPD', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Cookies],
      providers: [provideZonelessChangeDetection(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Cookies);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render H1', async () => {
    const fixture = TestBed.createComponent(Cookies);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Política de Cookies');
  });
});
