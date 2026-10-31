import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap, timer } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Btn } from '@shared/components/btn/btn';
import { SnackbarService } from '../common/snackbar/snackbar.service';
import { Store, StoreService } from '../shared/services/store.service';
import { UserPayloadEdit } from '../user/user-model.type';
import { UserService } from '../user/user.service';
import { ProfileForm } from './profile-form/profile-form';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [Btn, ProfileForm],
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
  private readonly _snackbarSrv = inject(SnackbarService);

  // MODEL
  ////

  readonly store: Signal<Store> = this._storeSrv.state;

  // CTRL
  ////

  protected readonly btnBlueSlim: string = Btn.style('blue', 'transparent', 'normal', ['raise']);
  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);
  protected readonly btnRedSlim: string = Btn.style('red', 'outline', 'slim', ['raise', '3d-red']);
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
      ? setTimeout(() => this.formPatch.update((open) => !open), 250)
      : this._userSrv
          .profileDelete(id)
          .pipe(
            tap((c) => {
              this._storeSrv.setState('userProfile', null);
              setTimeout(() => this.formPatch.set(false), 250);
              // 'User' self deletion vs. 'Admin'|'Super' deletion upon 'User'
              if (this._storeSrv.state().userLogged?.id === id) {
                this._storeSrv.setState('userLogged', null);
                setTimeout(() => this._router.navigate(['']), 4000);
              } else setTimeout(() => this._router.navigate(['users']), 4000);
            }),
          )
          .subscribe(); // 1-time subs
  }

  protected onPatch(payload: UserPayloadEdit & { id: string }) {
    const patch: UserPayloadEdit = { name: payload.name, password: payload.password };
    this._userSrv
      .profileUpdate(payload.id, patch)
      .pipe(
        tap((profile) => {
          this._storeSrv.setState('userProfile', profile);
        }),
        switchMap(() =>
          this._snackbarSrv.notifying$().pipe(
            takeUntil(timer(5000)),
            distinctUntilChanged(),
            filter((open) => !open && patch.password !== null),
            tap(() =>
              this._snackbarSrv
                .setIcon('icon-info')
                .setMsg('El cambio de contraseña surtirá efecto al reiniciar sesión.')
                .notify()
                .during(4000),
            ),
          ),
        ),
      )
      .subscribe(); // 1-time susbs
    setTimeout(() => this.formPatch.set(false), 250);
  }

  protected back() {
    setTimeout(() => this._router.navigate(['users']), 250);
  }
}

/* CRUD PERMISSIONS TODO: test all positiva cases
 *
 * Role 'User'  can -RUD itself -✅✅✅
 * Role 'Admin' can -RUD role 'User' -✅✅✅
 * Role 'Admin' can -RU- itself -✅✅-
 * Role 'Super' can -RUD role 'User' -✅✅✅
 * Role 'Super' can -RU- role 'Admin' -✅✅-
 * Role 'Super' can -RU- itself -✅✅-
 */
