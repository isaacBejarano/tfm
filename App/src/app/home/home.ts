import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { env } from '@env/env.dev';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  // DI
  // private readonly _http = inject(HttpClient);

  // CTRL
  ////

  private readonly _env = env;
  readonly count = signal(0);
  readonly smoked = toSignal(
    // this._http.get<DtoResponse<DtoId>>(this._env.getApi + '/smoke/full').pipe(
    //   filter((dto) => dto.count > 0),
    //   tap((dto) => this.count.set(dto.count)),
    //   map((dto) => dto.items),
    // ),
    of(['']),
    { initialValue: [] },
  );
}
