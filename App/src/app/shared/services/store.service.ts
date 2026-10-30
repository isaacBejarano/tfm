import { computed, Service, signal } from '@angular/core';

import { FormType } from '@app/auth/types/form.type';
import { UserDto } from '@shared/types/dto.type';

export type Store = {
  formAuth: FormType;
  accesToken: string;
  userLogged: UserDto | null;
  userProfile: UserDto | null;
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
  });

  readonly state = computed(() => this._store());

  setState<K extends keyof Store>(key: K, value: Store[K]) {
    this._store.update((s) => ({ ...s, [key]: value }));
  }
}
