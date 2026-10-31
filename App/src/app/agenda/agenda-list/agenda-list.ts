import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { Btn } from '@shared/components/btn/btn';
import { checkGuidv7 } from '../../shared/utils/params.util';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.html',
  imports: [Btn],
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
      id: 1,
      title: 'Agenda 1 - otoño',
    },
    {
      id: 2,
      title: 'Agenda 2 - invierno',
    },
  ]);

  agendaManagment(id: string): never | void {
    checkGuidv7(id);
    setTimeout(() => this._router.navigate(['agendas', id]), 250);
  }
}
