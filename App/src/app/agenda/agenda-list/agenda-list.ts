import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DtoAgenda } from '@agenda/agenda-dto.type';
import { Season } from '@agenda/agenda.enum';
import { Btn } from '@shared/components/btn/btn';
import { GUID_EMPTY } from '@shared/constants/unit';
import { LanguageService } from '@shared/services/lang.service';
import { checkGuidv7 } from '@shared/utils/params.util';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.html',
  imports: [Btn],
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-mobile);
    }
  `,
})
export class AgendaList {
  // DI
  private readonly _router = inject(Router);
  readonly languageSrv = inject(LanguageService);

  // CTRL
  ////

  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);

  // Model src
  // FIXME: get real Agenda by User Id & remove MOCKS
  private readonly _guidMock = GUID_EMPTY.slice(0, GUID_EMPTY.length - 1);
  protected readonly agendas = signal<DtoAgenda[]>([
    {
      id: this._guidMock + '1',
      created: new Date().toISOString(), // ~today
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'Agenda 1',
      seasonStart: Season.Fall,
      gardenTasks: [],
    },
    {
      id: this._guidMock + '2',
      created: new Date().toISOString(), // ~today
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'Agenda 2',
      seasonStart: Season.Winter,
      gardenTasks: [],
    },
  ]);

  protected agendaManagment(id: string): never | void {
    checkGuidv7(id);
    setTimeout(() => this._router.navigate(['agendas', id]), 250);
  }

  protected agendaNew() {
    alert('NUEVA AGENDA: En construcción');
  }
}
