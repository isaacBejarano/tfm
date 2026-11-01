import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { Btn } from '@shared/components/btn/btn';

enum FitoElement {
  capsaicine,
  alicine,
  antocianine,
  flavonoids,
  polyphenols,
  carotenoids,
  fitoestrogens,
  phytosterols,
  empty,
}

export enum Season {
  Winter,
  Spring,
  Summer,
  Fall,
}

type Crop = {
  id: string; // guuid
  // taxonomy
  vernacular: string;
  taxonList?: string;
  species?: string;
  // health
  healthBenefit?: string;
  fitoElements?: FitoElement;
  // desc
  habitat?: string;
  soilType?: string;
  soilComposition?: string;
  stem?: string;
  leaves?: string;
  roots?: string;
  buds?: string;
  flowers?: string;
  fruits?: string;
  // care
  exposureSun?: string;
  exposureHeat?: string;
  exposureCold?: string;
  exposureMoist?: string;
  exposureWind?: string;
  exposureRain?: string;
  watering?: string;
  pollination?: string;
  fertilization?: string;
  fruitCare?: string;
  evapoCoeficient?: string;
  // menaces
  plagueVertebrates?: string[];
  plagueBugs?: string[];
  plagueFungae?: string[];
  plagueUnicellular?: string[];
};

export type DtoAgenda = {
  id: string; // guuid
  userId: string; // guuid -> 1 user has many agendas
  title: string;
  created: string; // agenda's TODAY Date
  seasonStart: Season; // Season
  gardenTasks: GardenTask[];
};

type GardenTask = {
  id: string; // guuid
  agendaId: string; // guuid -> 1 agenda has many tasks
  date: Date;
  action: GardenAction;
  crops: Crop[];
};

type GardenIcon = '🌱' | '💧' | '☔' | '🌼' | '⛄' | '🌞' | '⛅' | '🚜';
type GardenAction =
  'watering' | 'seeding' | 'harvest' | 'rain' | 'blossom' | 'snow' | 'sun' | 'clouds';

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

  // CTRL
  ////

  protected readonly today = new Date();
  protected readonly currentWeekGrid = signal<Date[]>([]); // UI
  protected readonly currentWeekMonday = signal<Date | null>(null); // UI
  protected readonly agenda = signal<DtoAgenda | null>(null); // Model src

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

  protected resetWeekMonday(slide: 'prev' | 'next') {
    const monday = structuredClone(this.currentWeekMonday()!);
    monday.setDate(monday.getDate() + (slide === 'prev' ? -7 : 7));
    this.currentWeekMonday.set(monday);
    this._renderWeekGrid();
  }

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

  protected readonly btnGreenSlim: string = Btn.style('green', 'outline', 'slim', ['raise']);
  protected readonly btnGraySlim: string = Btn.style('gray', 'outline', 'slim', [
    'raise',
    '3d-gray',
  ]);

  protected getCurrentWeekTasks(day: Date): GardenTask[] {
    return this.agenda()!.gardenTasks.filter((task) => this.sameDate(task.date, day));
  }

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

  // TODO: duplicated at route "agendas/"" -> use Utils
  protected toLangSeason(local: 'es', season: Season): string {
    return local === 'es' ? this.seasonToES(season) : '';
  }
  protected seasonToES(season: Season): string {
    const seasonES: Record<Season, string> = {
      [Season.Fall]: 'Otoño',
      [Season.Winter]: 'Invierno',
      [Season.Spring]: 'Primavera',
      [Season.Summer]: 'Verano',
    };
    return seasonES[season];
  }
  // TODO: Utils 'Date'
  protected sameDate(dateA: Date, dateB: Date): boolean {
    return dateA.getTime() === dateB.getTime();
  }

  // TODO: lang SRV
  // dayToCA, dayToGa, dayToPT, dayToAST, dayToAN, dayToOC, dayToEU <- iberian langs
  protected toLangGardenAction(local: 'es', action: GardenAction): string {
    return local === 'es' ? this.gardenActionToES(action) : '';
  }
  protected gardenActionToES(action: GardenAction): string {
    const actionES: Record<GardenAction, string> = {
      watering: 'Riego',
      seeding: 'Siembra',
      harvest: 'Cosecha',
      blossom: 'Floración',
      rain: 'Lluvia',
      snow: 'Nieve',
      sun: 'Sol',
      clouds: 'Nubles',
    };
    return actionES[action];
  }
  protected toLangDay(local: 'es', day: string | null): string {
    return local === 'es' ? this.dayToES(day) : (day ?? '');
  }
  protected dayToES(day: string | null): never | string {
    if (!day) throw new Error('ERROR: day string required.');
    const daysES: Record<string, string> = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return daysES[day.toLowerCase()];
  }
  protected toLangMonth(local: 'es', month: string | null): string {
    return local === 'es' ? this.monthToES(month) : (month ?? '');
  }
  protected monthToES(month: string | null): never | string {
    if (!month) throw new Error('ERROR: month string required.');
    const _month: string[] = month.split(' ');
    const head: string = _month[0] ?? '';
    const tail: string = _month[1] ?? '';
    const monthsES: Record<string, string> = {
      jan: 'Ene',
      apr: 'Abr',
      aug: 'Ago',
      dec: 'Dic',
    };
    return `${head} ${monthsES[tail.toLowerCase()] ?? tail}`;
  }

  // TODO:
  protected backToWeek() {
    alert('volver a cargar ESTA SEMANA');
  }

  protected back() {
    setTimeout(() => this._router.navigate(['agendas']), 250);
  }
}
