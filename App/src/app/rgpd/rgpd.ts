import { AfterViewInit, Component, DOCUMENT, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.html',
})
export class Rgpd implements AfterViewInit {
  // DI
  private readonly _docu = inject(DOCUMENT);
  private readonly _router = inject(Router);

  // CTRL
  ////

  readonly appName = 'Kübello';

  // SEO
  ngAfterViewInit(): void {
    const canonical: Element | null = this._docu.querySelector('[rel="canonical"]');
    if (!canonical) return;
    canonical.setAttribute('href', 'https://kuebello.netlify.app' + this._router.url);
  }
}
