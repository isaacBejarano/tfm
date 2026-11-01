import { Service } from '@angular/core';

import { Season } from '@agenda/agenda.enum';
import { GardenAction } from '../../agenda/agenda-model.type';

@Service()
export class LanguageService {
  // ES, CA, GA, PT, AST, AN, OC, EU <- iberian langs

  toLangSeason(local: 'es', season: Season): string {
    return local === 'es' ? this._seasonToES(season) : '';
  }

  private _seasonToES(season: Season): string {
    const seasonES: Record<Season, string> = {
      [Season.Fall]: 'Otoño',
      [Season.Winter]: 'Invierno',
      [Season.Spring]: 'Primavera',
      [Season.Summer]: 'Verano',
    };
    return seasonES[season];
  }

  toLangGardenAction(local: 'es', action: GardenAction): string {
    return local === 'es' ? this.gardenActionToES(action) : '';
  }

  private gardenActionToES(action: GardenAction): string {
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

  toLangDay(local: 'es', day: string | null): string {
    return local === 'es' ? this.dayToES(day) : (day ?? '');
  }

  private dayToES(day: string | null): never | string {
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

  toLangMonth(local: 'es', month: string | null): string {
    return local === 'es' ? this.monthToES(month) : (month ?? '');
  }

  private monthToES(month: string | null): never | string {
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
}
