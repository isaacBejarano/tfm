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

  // FIXME: types
  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);

  protected readonly agendas = signal<any[]>([
    {
      id: GUID_EMPTY,
      title: 'Agenda 1 - otoño',
    },
    {
      id: GUID_EMPTY,
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
