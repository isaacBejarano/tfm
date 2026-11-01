import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs';
import { UserDto } from '../user-dto.type';
import { UserService } from '../user.service';
// TODO: cerate barrels to import all files from @agenda for example

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class UserList {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _userSrv = inject(UserService);

  // CTRL
  ////

  protected readonly users = signal<UserDto[]>([]);

  protected profile(id: string) {
    setTimeout(() => this._router.navigate(['users', id]), 250);
  }

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        switchMap(() => this._userSrv.profileList().pipe(tap((u) => this.users.set(u)))),
      )
      .subscribe();
  }
}
