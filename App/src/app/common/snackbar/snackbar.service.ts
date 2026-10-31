import { Service } from '@angular/core';
import { IconSnackbar } from '@app/shared/types/icons.type';
import { BehaviorSubject, Observable } from 'rxjs';

type SnackbarConfig = { msg: string; open: boolean; snackbarIcon: IconSnackbar };

@Service()
export class SnackbarService {
  // STATE
  ////

  readonly defaults: SnackbarConfig = {
    msg: '...',
    open: false,
    snackbarIcon: 'icon-info',
  };

  private readonly _open$$ = new BehaviorSubject<boolean>(this.defaults.open);
  private readonly _msg$$ = new BehaviorSubject<string>(this.defaults.msg);
  private readonly _icon$$ = new BehaviorSubject<IconSnackbar>(this.defaults.snackbarIcon);

  notifying$(): Observable<boolean> {
    return this._open$$.asObservable();
  }

  msg$(): Observable<string> {
    return this._msg$$.asObservable();
  }

  icon$(): Observable<IconSnackbar> {
    return this._icon$$.asObservable();
  }

  // builder pattern...

  setIcon(icon: IconSnackbar) {
    this._icon$$.next(icon);
    return this;
  }

  setMsg(str: string) {
    this._msg$$.next(str);
    return this;
  }

  notify(state: boolean = true) {
    this._open$$.next(state);
    return this;
  }

  // last pipe
  during(duration: number) {
    return setTimeout(() => this.notify(false), duration);
  }
}
