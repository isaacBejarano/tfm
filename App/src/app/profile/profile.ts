import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Btn } from '@shared/components/btn/btn';
import { WebService } from '@shared/services/web.service';
import { DtoResponse, DtoUser } from '@shared/types/dto.type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [Btn],
})
export class Profile {
  // DI
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  // CTRL
  ////

  readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', ['raise', '3d-gray']);
  readonly btnRedSlim: string = Btn.style('red', 'outline', 'slim', ['raise', '3d-red']);
  readonly btnRoseSlim: string = Btn.style('rose', 'outline', 'slim', ['raise', '3d-rose']);

  protected readonly _user = signal<DtoUser | null>(null);

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        map((route) => route.snapshot.params['id']),
        switchMap((id) => this._getProfile(id)),
      )
      .subscribe();
  }

  private _getProfile(id: string): Observable<DtoUser> {
    // TODO: extract into User SRV
    return this._http
      .get<DtoResponse<DtoUser>>(this._webSrv.domain.api.get() + `/users/${id}`, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        map((res) => res.body),
        filter((body) => body !== null),
        filter((dto) => dto.count === 1),
        map((dto) => dto.items[0]),
        tap((user) => this._user.set(user)),
      );
  }

  protected readonly patch = signal<boolean>(false);

  protected action(action: 'patch' | 'delete', id: string) {
    action === 'patch' ? this.patch.set(true) : alert('DELETE' + id);
  }

  protected onSubmit(e: Event) {
    e.preventDefault();
    alert('PATCH');

    setTimeout(() => this.patch.set(false), 250);
  }
}
