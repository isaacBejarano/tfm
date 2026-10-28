import { Component, DestroyRef, DOCUMENT, effect, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Footer } from '@app/common/footer/footer';
import { Header } from '@app/common/header/header';
import { LoaderService } from '@app/common/loader/loader.service';
import { Snackbar } from '@app/common/snackbar/snackbar';
import { SnackbarService } from '@app/common/snackbar/snackbar.service';
import { Loader } from '@common/loader/loader';
import { WebService } from '@shared/services/web.service';

@Component({
  imports: [RouterOutlet, Header, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  // DI
  private readonly _docu = inject(DOCUMENT);
  private readonly _meta = inject(Meta);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _overlay = inject(Overlay);
  private readonly _webSrv = inject(WebService);
  private readonly _loaderService = inject(LoaderService);
  private readonly _snackbarService = inject(SnackbarService);

  // CTRL
  ////

  readonly title = signal('Kübello');

  // Loader state
  private readonly _showLoader = toSignal<boolean, false>(
    this._loaderService.loading$(), // unsubscribed by toSignal
    { initialValue: false },
  );

  // Snackbar state
  private readonly _showSnackbar = toSignal<boolean, false>(
    this._snackbarService.notifying$(), // unsubscribed by toSignal
    { initialValue: false },
  );

  // CDK Overlay config

  private readonly _overlayOutletForLoader: OverlayRef = this._overlay.create({
    positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
    scrollStrategy: this._overlay.scrollStrategies.block(),
    hasBackdrop: false,
  });

  private readonly _overlayOutletForSnackbar: OverlayRef = this._overlay.create({
    positionStrategy: this._overlay.position().global().centerHorizontally().top(),
    scrollStrategy: this._overlay.scrollStrategies.reposition(),
    hasBackdrop: true,
    backdropClass: 'bg-transparent',
  });

  constructor() {
    // SEO
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute.firstChild), // e.g. class_App -> class _Rgpd
        filter((route) => route !== null),
        filter((route) => route.snapshot.data['isCanonical'] ?? false),
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
        ? this._overlayOutletForLoader.attach(new ComponentPortal(Loader))
        : this._overlayOutletForLoader.detach(),
    );

    // CDK Overlay the Snackbar
    effect(() => {
      this._showSnackbar()
        ? this._overlayOutletForSnackbar.attach(new ComponentPortal(Snackbar))
        : this._overlayOutletForSnackbar.detach();
    });

    this._overlayOutletForSnackbar
      .backdropClick()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        tap(() => {
          this._overlayOutletForSnackbar.detach();
          this._snackbarService.notify(false); // close pending Observable emissions
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._overlayOutletForLoader.dispose();
    this._overlayOutletForSnackbar.dispose();
  }
}
