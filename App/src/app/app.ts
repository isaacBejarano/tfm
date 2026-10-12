import { Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';
import { env } from '@env/env.dev';
import { filter, map, tap } from 'rxjs';

@Component({
  imports: [RouterOutlet, RouterLinkWithHref],
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

  // CTRL
  ////

  private readonly _env = env;
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
          canonical.setAttribute('href', `${this._env.host}/${path}`);
          robots.setAttribute('content', 'follow, index');
        }),
      )
      .subscribe();
  }
}

// TODO: locale 'ES'
//
