import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { WebService } from '../shared/services/web.service';
import { ResponseDto, UserDto } from '../shared/types/dto.type';

@Component({
  selector: 'app-user',
  template: `
    <h1 class="mb-4 text-2xl text-blue-500 text-center">Lista de Usuarios</h1>

    @let users = _users();

    <!-- TODO: CDK virtual scroll -->
    <ol class="p-2 border border-blue-500/25 rounded-xl">
      @for (
        user of users;
        track user.id;
        let idx = $index, e = $even, c = $count, first = $first, last = $last, odd = $odd
      ) {
        <li
          class="mb-2 p-2 border border-rose-500/25 rounded-xl cursor-pointer hover:bg-rose-700/5 active:bg-rose-500/8"
          (click)="profile(user.id)"
        >
          <ul class="ml-2">
            <li>
              <span class="text-rose-500"> Correo Electrónico: </span>
              {{ user.email }}
            </li>
            <li>
              <span class="text-rose-500"> Nombre: </span>
              {{ user.name ?? 'Anónimo' }}
            </li>
            <li>
              <span class="text-rose-500"> Roles: </span>
              {{ user.roles }}
            </li>
            <li>
              <span class="text-rose-500"> Orden </span>
              {{ idx + 1 }}
            </li>
          </ul>
        </li>
      } @empty {
        <li class="text-red-500">No hay usuarios visibles.</li>
      }
    </ol>
  `,
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
  private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  // CTRL
  ////

  protected readonly _users = signal<UserDto[]>([]);

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        switchMap(() => this._getUserList()),
      )
      .subscribe();
  }

  private _getUserList(): Observable<UserDto[]> {
    // TODO: extract into User SRV
    return this._http
      .get<ResponseDto<UserDto>>(this._webSrv.domain.api.get() + '/users', {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        filter((res) => res.status === HttpStatusCode.Ok),
        map((res) => res.body),
        filter((body) => body !== null),
        filter((dto) => dto.count > 0),
        map((dto) => dto.items),
        tap((users) => this._users.set(users)),
      );
  }

  profile(id: string) {
    this._router.navigate(['users', id]);
  }
}
