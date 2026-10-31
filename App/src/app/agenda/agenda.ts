import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  // imports: [Btn, ProfileForm],
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class Agenda {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _storeSrv = inject(StoreService);

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        map((route) => route.snapshot.params['id'] as string), // ID of agenda (from URL path var)
        tap((id) => console.warn('Retriveing AGENDA ' + id)), // TODO: get Agenda by Id
      )
      .subscribe();
  }
}
