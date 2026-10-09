import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { DtoId, DtoResponse } from './shared/typings/smoke.dto';

@Component({
  imports: [RouterOutlet, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
})
// implements OnInit
export class App implements OnInit {
  // DI
  private readonly _http = inject(HttpClient);

  // CTRL
  readonly title = signal('Kübello');
  private readonly _domain = 'https://localhost:7247';
  private readonly _api = this._domain + '/api/v1';
  readonly count = signal(0);

  readonly smoked = toSignal(
    this._http.get<DtoResponse<DtoId>>(this._api + '/smoke/full').pipe(
      tap(console.table),
      filter((dto) => dto.count > 0),
      tap((dto) => {
        console.warn(dto.msg);
        this.count.set(dto.count);
      }),
      map((dto) => dto.items),
    ),
    { initialValue: [] },
  );

  ngOnInit(): void {
    this._http.get(this._api + '/smoke/almost').subscribe(console.table); // 1-time subs
  }
}
