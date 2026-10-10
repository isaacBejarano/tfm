import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { DtoId, DtoResponse } from './shared/typings/smoke.dto';

@Component({
  imports: [RouterOutlet, CommonModule, RouterLinkWithHref],
  selector: 'app-root',
  templateUrl: './app.html',
})
// implements OnInit
export class App {
  // DI
  private readonly _http = inject(HttpClient);

  // CTRL
  readonly title = signal('Kübello');
  private readonly _domain = 'https://localhost:7247';
  private readonly _api = this._domain + '/api/v1';
  readonly count = signal(0);

  readonly smoked = toSignal(
    this._http.get<DtoResponse<DtoId>>(this._api + '/smoke/full').pipe(
      filter((dto) => dto.count > 0),
      tap((dto) => this.count.set(dto.count)),
      map((dto) => dto.items),
    ),
    { initialValue: [] },
  );
}
