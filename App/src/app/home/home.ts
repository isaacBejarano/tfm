import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { WebService } from '../shared/services/web.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  // DI
  // private readonly _http = inject(HttpClient);
  private readonly _webSrv = inject(WebService);

  // CTRL
  ////

  readonly count = signal(0);
  readonly smoked = toSignal(
    // this._http.get<DtoResponse<DtoId>>(this._webSrv.domain.api.get() + '/smoke/full').pipe(
    //   filter((dto) => dto.count > 0),
    //   tap((dto) => this.count.set(dto.count)),
    //   map((dto) => dto.items),
    // ),
    of(['']),
    { initialValue: [] },
  );
}
