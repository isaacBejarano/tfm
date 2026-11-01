import { Component, DestroyRef, inject, OnInit, output, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { BehaviorSubject, distinctUntilChanged, filter, tap } from 'rxjs';

import { AgendaPayload } from '@agenda/agenda-dto.type';
import { Agenda } from '@agenda/agenda-model.type';
import { Btn } from '@shared/components/btn/btn';
import { validationBorder } from '@shared/utils/form-field.util';
import { Store, StoreService } from '../../shared/services/store.service';
import { Season } from '../agenda.enum';
// TODO: cerate barrels to import all files from @agenda for example

@Component({
  selector: 'app-agenda-form',
  templateUrl: './agenda-form.html',
  imports: [Btn, FormField],
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AgendaForm implements OnInit {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _storeSrv = inject(StoreService);

  // MODEL
  private readonly _defaultAgenda = signal<Agenda>({
    id: '',
    userId: '',
    title: '',
    created: '',
    seasonStart: Season.Winter,
    gardenTasks: [],
  });

  constructor() {
    this._defaultAgenda.update((agenda) => {
      const userId = this._store().userLogged?.id ?? '';
      return {
        ...agenda,
        userId,
      };
    });
  }

  // FORM
  protected readonly form = form(this._defaultAgenda, (field) => {
    // title
    required(field.title, { message: "El campo 'Título' es obligatorio." });
    maxLength(field.title, 50); // Adds MAX_LENGTH property to HTML
    // title
    // required(field.seasonStart, { message: "El campo 'Título' es obligatorio." });
    // TODO: selector de Season
    // TODO: selector de gardenTasks
  });

  // CTRL
  ////

  private readonly _store: Signal<Store> = this._storeSrv.state;

  // UI utils
  readonly validationBorder = validationBorder;
  protected readonly btnGray: string = Btn.style('gray', 'outline', 'normal', ['raise', '3d-gray']);
  protected readonly btnRoseSlim: string = Btn.style('rose', 'outline', 'slim', [
    'raise',
    '3d-rose',
  ]);

  // I/O
  protected readonly $agendaPayload = output<AgendaPayload>();

  // UX -> block rapid multiple submit
  private readonly _debounceForm$$ = new BehaviorSubject<AgendaPayload | null>(null);

  ngOnInit(): void {
    this._debounceForm$$
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((details) => details !== null),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((details) => this.$agendaPayload.emit(details)),
        tap(() => this._debounceForm$$.next(null)),
      )
      .subscribe();
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();

    if (this.form().invalid()) {
      this.form.title().markAsDirty();
      // ...
      return;
    }

    const form: Agenda = this.form().value();
    this._debounceForm$$.next(form);
  }
}
