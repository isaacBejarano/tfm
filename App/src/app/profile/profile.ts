import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { filter, map, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Btn } from '@shared/components/btn/btn';
import { Store, StoreService } from '../shared/services/store.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [Btn],
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class Profile {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _userSrv = inject(UserService);
  private readonly _storeSrv = inject(StoreService);

  // MODEL
  ////

  readonly store: Signal<Store> = this._storeSrv.state;

  // CTRL
  ////

  readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', ['raise', '3d-gray']);
  readonly btnRedSlim: string = Btn.style('red', 'outline', 'slim', ['raise', '3d-red']);
  readonly btnRoseSlim: string = Btn.style('rose', 'outline', 'slim', ['raise', '3d-rose']);
  protected readonly formPatch = signal<boolean>(false);

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        map((route) => route.snapshot.params['id'] as string), // ID of userProfile (from URL path var)
        tap((id) => this._profileRead(id)),
      )
      .subscribe();
  }

  private _profileRead(id: string) {
    this._userSrv
      .profileRead(id)
      .pipe(tap((profile) => this._storeSrv.setState('userProfile', profile)))
      .subscribe(); // 1-time susbs
  }

  protected action(action: 'patch' | 'delete', id: string) {
    action === 'patch'
      ? this.formPatch.update((open) => !open)
      : this._userSrv
          .profileDelete(id)
          .pipe(
            tap(() => {
              this._storeSrv.setState('userProfile', null);
              // self deletion
              if (this._storeSrv.state().userLogged?.id === id) {
                this._storeSrv.setState('userLogged', null);
                this._router.navigate(['']);
              }
            }),
          )
          .subscribe(); // 1-time subs
  }

  protected onPatch(e: Event) {
    e.preventDefault();

    // this._userSrv.profileDelete(id); // TODO: FORM

    setTimeout(() => this.formPatch.set(false), 250);
  }
}

/* CRUD PERMISSIONS
 *
 * Role 'User'  can -RUD itself       -> loggedUserId === id (User)
 * Role 'Admin' can -RUD role 'User'  -> loggedUserId !== id (User)
 * Role 'Admin' can -RU- itself       -> loggedUserId === id (Admin)
 * Role 'Super' can -RUD role 'User'  -> loggedUserId !== id (User)
 * Role 'Super' can -RU- role 'Admin' -> loggedUserId !== id (Admin)
 * Role 'Super' can -RU- itself       -> loggedUserId === id (Super)
 */
