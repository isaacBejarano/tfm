import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Footer } from '@common/components/footer/footer';
import { Header } from '@common/components/header/header';
import { Loader } from '@common/components/loader/loader';
import { LoaderService } from '@common/services/loader.service';
import { WebService } from '@shared/services/web.service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _docu = inject(DOCUMENT);
  private readonly _meta = inject(Meta);
  private readonly _overlay = inject(Overlay);
  private readonly _loaderService = inject(LoaderService);
  private readonly _webSrv = inject(WebService);
  private readonly _http = inject(HttpClient);

  // CTRL
  ////

  readonly title = signal('Kübello');

  // Loader state
  private readonly _showLoader = toSignal<boolean, false>(
    this._loaderService.loading$(), // unsubscribed by toSignal & App destruction
    { initialValue: false },
  );

  // CDK Overlay config
  private readonly _overlayOutlet: OverlayRef = this._overlay.create({
    hasBackdrop: false, // true for ARIA only if overlay holds an intertactive component (e.g. close alert msg)
    backdropClass: 'overlay-full-blocking',
    positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
    scrollStrategy: this._overlay.scrollStrategies.block(),
  });

  constructor() {
    // SEO
    this._router.events
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

    // CDK Overlay the Loader
    effect(() =>
      this._showLoader()
        ? this._overlayOutlet.attach(new ComponentPortal(Loader))
        : this._overlayOutlet.detach(),
    );
  }

  ngOnInit(): void {
    // FIXME: remove SMOKE TEST
    this._http.get(this._webSrv.domain.api.get() + '/smoke/full').subscribe(console.warn); // 1-tie subscription
  }
}

// TODO: locale 'ES'
// TODO: enable Firefox eRader
