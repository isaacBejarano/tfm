import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AgendaPayload, DtoAgenda } from '@agenda/agenda-dto.type';
import { Season } from '@agenda/agenda.enum';
import { GUID_EMPTY } from '@app/shared/constants/guuid-unit';
import { Btn } from '@shared/components/btn/btn';
import { LanguageService } from '@shared/services/lang.service';
import { checkGuidv7 } from '@shared/utils/params.util';
import { AgendaForm } from '../agenda-form/agenda-form';
// TODO: cerate barrels to import all files from @agenda for example

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.html',
  imports: [Btn, AgendaForm],
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

  readonly formNew = signal<boolean>(false);

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
    setTimeout(() => this.formNew.update((open) => !open), 250);
  }

  // TODO:
  protected onCreate(payload: AgendaPayload) {
    console.table(payload);
    // this._agendaSrv
    //   .profileCreate(payload)
    //   .subscribe(); // 1-time susbs
    setTimeout(() => this.formNew.set(false), 250);
  }
}
