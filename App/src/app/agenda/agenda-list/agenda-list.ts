import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { Btn } from '@shared/components/btn/btn';
import { GUID_EMPTY } from '../../shared/constants/unit';
import { checkGuidv7 } from '../../shared/utils/params.util';

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

  // CTRL
  ////

  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);

  // FIXME: type Agenda
  private readonly _guidMock = GUID_EMPTY.slice(0, GUID_EMPTY.length - 1);
  protected readonly agendas = signal<any[]>([
    {
      id: this._guidMock + '1',
      title: 'Agenda 1 - otoño',
    },
    {
      id: this._guidMock + '2',
      title: 'Agenda 2 - invierno',
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
