import { Service } from '@angular/core';
import { BehaviorSubject, concatMap, delay, Observable, of } from 'rxjs';

@Service()
export class LoaderService {
  // STATE
  ////

  private readonly _loading$$ = new BehaviorSubject<boolean>(false);

  loading$(): Observable<boolean> {
    return this._loading$$.asObservable().pipe(concatMap((loaded) => of(loaded).pipe(delay(500))));
  }

  load(b: boolean): void {
    this._loading$$.next(b);
  }
}
