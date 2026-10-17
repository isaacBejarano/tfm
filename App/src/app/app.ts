import { Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { Footer } from '@common/components/footer/footer';
import { Header } from '@common/components/header/header';
import { WebService } from '@shared/services/web.service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
// implements OnInit
export class App {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _docu = inject(DOCUMENT);
  private readonly _meta = inject(Meta);

  // private readonly _overlay = inject(Overlay);

  // CTRL
  ////

  private readonly _webSrv = inject(WebService);
  readonly title = signal('Kübello');

  constructor() {
    const canonicalBase = this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute.firstChild), // e.g. class_App -> class _Rgpd
        filter((route) => route !== null),
        filter((route) => route.snapshot.data['isCanonical']),
        map((route) => route.snapshot.routeConfig?.path ?? ''),
        tap((path) => {
          const canonical: HTMLLinkElement | null = this._docu.querySelector('[rel="canonical"]');
          const robots: HTMLMetaElement | null = this._meta.getTag('name="robots"');
          if (!canonical || !robots) {
            console.error('SEO config.');
            return;
          }
          canonical.setAttribute('href', `${this._webSrv.domain.prod.host}/${path}`);
          robots.setAttribute('content', 'follow, index');
        }),
      )
      .subscribe();
  }
}

// TODO: locale 'ES'
//
