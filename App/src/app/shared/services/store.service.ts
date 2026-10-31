import { computed, Service, signal } from '@angular/core';

import { AuthFormType } from '@app/auth/auth-form/auth-form.type';
import { UserDto } from '@shared/types/dto.type';

export type Store = {
  formAuth: AuthFormType;
  accesToken: string;
  userLogged: UserDto | null;
  userProfile: UserDto | null;
  isAgendaLoaded: boolean;
};

@Service()
export class StoreService {
  // STATE
  ////

  private readonly _store = signal<Store>({
    formAuth: '',
    accesToken: '',
    userLogged: null,
    userProfile: null,
    isAgendaLoaded: false, // FIXME: it is actually being used?
  });

  readonly state = computed(() => this._store());

  setState<K extends keyof Store>(key: K, value: Store[K]) {
    this._store.update((s) => ({ ...s, [key]: value }));
  }
}
