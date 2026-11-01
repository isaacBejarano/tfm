import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { DtoAgenda, GardenAction, GardenIcon, GardenTask } from '@agenda/agenda-dto.type';
import { Season } from '@agenda/agenda.enum';
import { Btn } from '@shared/components/btn/btn';
import { LanguageService } from '@shared/services/lang.service';
import { sameDate } from '@shared/utils/date.util';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.html',
  imports: [CommonModule, Btn],
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-desktop);
    }
  `,
})
export class Agenda {
  // DI
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  readonly languageSrv = inject(LanguageService);

  // MODEL
  protected readonly agenda = signal<DtoAgenda | null>(null); // src

  // CTRL
  ////

  protected readonly sameDate = sameDate; // Utils
  protected readonly today = new Date();

  // UI

  protected readonly currentWeekGrid = signal<Date[]>([]);
  protected readonly currentWeekMonday = signal<Date | null>(null);
  protected readonly icons: Record<GardenAction, GardenIcon> = {
    seeding: '🌱',
    watering: '💧',
    rain: '☔',
    harvest: '🚜',
    blossom: '🌼',
    snow: '⛄',
    sun: '🌞',
    clouds: '⛅',
  };
  protected readonly colors: Record<GardenAction, string> = {
    seeding: 'text-lime-300',
    watering: 'text-sky-300',
    rain: 'text-blue-300',
    harvest: 'text-amber-300',
    blossom: 'text-pink-300',
    snow: 'text-white/75',
    sun: 'text-yellow-300',
    clouds: 'text-purple-300',
  };
  protected readonly btnGreenOutlineSlim: string = Btn.style('green', 'outline', 'slim', ['raise']);
  protected readonly btnGreenSlim: string = Btn.style('green', 'transparent', 'slim', ['raise']);
  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);

  constructor() {
    this._router.events
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter((e) => e instanceof NavigationEnd),
        map(() => this._activatedRoute),
        filter((route) => route !== null),
        map((route) => route.snapshot.params['id'] as string), // ID of agenda (from URL path var)
        tap((agendaId) => {
          // flat today's UTC Time before Agenda & currentWeekMonday & _renderWeekGrid setting!
          this.today.setHours(0, 0, 0, 0); // mutate to flat UTC Time to 0 so it neglects hour:min:sec comparisons

          this._setWeekMonday();
          this._renderWeekGrid();
          // FIXME: get Agenda by Id & remove MOCK
          // TODO. AGENDA SETTING -> based on user and crop selection, it calculates days for seeding, watering, etc
          this.agenda.set({
            id: agendaId,
            userId: '10000000-0000-0000-0000-000000000000',
            title: agendaId === '00000000-0000-0000-0000-000000000001' ? 'Agenda 1' : 'Agenda 2',
            seasonStart:
              agendaId === '00000000-0000-0000-0000-000000000001' ? Season.Fall : Season.Winter,
            created: new Date('2026-11-01T19:08:35.429Z').toISOString(), // ~today
            gardenTasks: [
              // watering
              {
                id: '11000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(7), // current week's Monday +7 -> next Week's Monday
                action: 'watering',
                crops: [
                  {
                    id: '00000000-0000-0000-0000-80000000000',
                    vernacular: 'Tomates',
                  },
                  {
                    id: '00000000-0000-0000-0000-90000000000',
                    vernacular: 'Pimientos',
                  },
                  {
                    id: '00000000-0000-0000-0001-00000000000',
                    vernacular: 'Lechuga',
                  },
                ],
              },
              {
                id: '12000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(4), // current week's Monday +4
                action: 'watering',
                crops: [
                  {
                    id: '00000000-0000-0000-0000-80000000000',
                    vernacular: 'Tomates',
                  },
                  {
                    id: '00000000-0000-0000-0000-90000000000',
                    vernacular: 'Pimientos',
                  },
                  {
                    id: '00000000-0000-0000-0001-00000000000',
                    vernacular: 'Lechuga',
                  },
                ],
              },
              {
                id: '13000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(1), // current week's Monday +1
                action: 'watering',
                crops: [
                  {
                    id: '00000000-0000-0000-0000-80000000000',
                    vernacular: 'Tomates',
                  },
                  {
                    id: '00000000-0000-0000-0000-90000000000',
                    vernacular: 'Pimientos',
                  },
                  {
                    id: '00000000-0000-0000-0001-00000000000',
                    vernacular: 'Lechuga',
                  },
                ],
              },
              // life cycle
              {
                id: '14000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(0), // current week's Monday
                action: 'seeding',
                crops: [
                  {
                    id: '00000000-0000-0000-0000-10000000000',
                    vernacular: 'Lechuga hoja de roble',
                  },
                  {
                    id: '00000000-0000-0000-0000-20000000000',
                    vernacular: 'Espinacas',
                  },
                  {
                    id: '00000000-0000-0000-0000-30000000000',
                    vernacular: 'Col Lombarda',
                  },
                  {
                    id: '00000000-0000-0000-0000-40000000000',
                    vernacular: 'Remolacha',
                  },
                  {
                    id: '00000000-0000-0000-0000-50000000000',
                    vernacular: 'Nabo Chino',
                  },
                ],
              },
              {
                id: '15000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(1), // current week's Monday +1
                action: 'blossom',
                crops: [
                  {
                    id: '00000000-0000-0000-0000-60000000000',
                    vernacular: 'White Ghost Pepper Naga Jolokia',
                  },
                  {
                    id: '00000000-0000-0000-0000-70000000000',
                    vernacular: 'Bell Pepper',
                  },
                ],
              },
              {
                id: '16000000-0000-0000-0000-000000000000',
                agendaId,
                date: this._daysAfterMonday(7), // current week's Monday +7 -> next Week's Monday
                action: 'harvest',
                crops: [
                  {
                    id: '00000000-0000-0000-0001-10000000000',
                    vernacular: 'Zanahorias',
                  },
                ],
              },
            ],
          });
        }),
      )
      .subscribe();
  }

  // sets 'currentWeekMonday'
  private _setWeekMonday(): void {
    const today: Date = structuredClone(this.today); // e.g. today Wed 28, or Sun 8
    const dayIdx: number = today.getDay(); // e.g. Wed is index 3 of 7, Sun is 0 <- [Sun..Sat]
    const dayIdxAdjustment: number = dayIdx === 0 ? -6 : 1;
    const dayOfMonthAsTime: number = today.getDate() - dayIdx + dayIdxAdjustment;
    // e.g.

    // Wed 28 - 3 + (day === 0 ? -6 : 1)
    // Sat 25     + (  3 === 0 ? -6 : 1)
    // Sat 25     + 1
    // Mon 26

    // Sun 8  - 0 + (day === 0 ? -6 : 1)
    // Sun 8      + (  0 === 0 ? -6 : 1)
    // Sat 8      - 6
    // Mon 2

    today.setDate(dayOfMonthAsTime); // mutate clone to update only its month day
    today.setHours(0, 0, 0, 0); // mutate clone to flat UTC Time to 0 so it neglects hour:min:sec comparisons
    this.currentWeekMonday.set(today);
  }

  // days in Agenda View grid must render after 'currentWeekMonday'
  private _renderWeekGrid() {
    const daysAfterWeekMonday: Date[] = [];

    for (let i = 0; i < 7; i++) {
      daysAfterWeekMonday.push(this._daysAfterMonday(i));
    }

    this.currentWeekGrid.set(daysAfterWeekMonday);
  }

  // planning is future -> +int
  private _daysAfterMonday(days: number): Date {
    if (days < 0) throw new Error('ERROR: Added days must be positive or 0.');
    const afterMonday = structuredClone(this.currentWeekMonday()!);
    afterMonday.setDate(afterMonday.getDate() + days);
    return afterMonday;
  }

  // nav to other week grids
  protected resetWeekMonday(slide: 'prev' | 'next') {
    setTimeout(() => {
      const monday = structuredClone(this.currentWeekMonday()!);
      monday.setDate(monday.getDate() + (slide === 'prev' ? -7 : 7));
      this.currentWeekMonday.set(monday);
      this._renderWeekGrid();
    }, 250);
  }

  protected getCurrentWeekTasks(day: Date): GardenTask[] {
    return this.agenda()!.gardenTasks.filter((task) => sameDate(task.date, day));
  }

  // UI utils

  protected isCurrentWeek(): boolean {
    const currentWeekSunday: Date = structuredClone(this.currentWeekMonday()!);
    const dayOfMonthAsTime: number = currentWeekSunday.getDate() + 6;
    currentWeekSunday.setDate(dayOfMonthAsTime); // mutate clone to update only its month day
    return this.today >= this.currentWeekMonday()! && this.today <= currentWeekSunday;
  }

  protected getIcon(action: GardenAction): GardenIcon {
    return this.icons[action];
  }

  protected getColor(action: GardenAction): string {
    return this.colors[action];
  }

  protected back() {
    setTimeout(() => this._router.navigate(['agendas']), 250);
  }

  protected backToCurrentWeek() {
    setTimeout(() => {
      this._setWeekMonday();
      this._renderWeekGrid();
    }, 250);
  }
}
