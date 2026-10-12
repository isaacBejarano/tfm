import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  // DI
  // private readonly _http = inject(HttpClient);
  // private readonly _docu = inject(DOCUMENT);

  // CTRL
  ////

  // private readonly _api = this._domain + '/api/v1';
  private readonly _domain = 'https://localhost:7247';
  readonly count = signal(0);

  readonly smoked = toSignal(
    // this._http.get<DtoResponse<DtoId>>(this._api + '/smoke/full').pipe(
    //   filter((dto) => dto.count > 0),
    //   tap((dto) => this.count.set(dto.count)),
    //   map((dto) => dto.items),
    // ),
    of(['']),
    { initialValue: [] },
  );
}
