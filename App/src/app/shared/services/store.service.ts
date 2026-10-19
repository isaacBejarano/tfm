import { computed, Service, signal } from '@angular/core';

import { FormType } from '@app/auth/types/form.type';

export type Store = {
  formAuth: FormType;
  accesToken: string;
};

@Service()
export class StoreService {
  // STATE
  ////

  private readonly _store = signal<Store>({
    formAuth: 'none',
    accesToken: '',
  });

  readonly state = computed(() => this._store());

  setState<K extends keyof Store>(key: K, value: Store[K]) {
    this._store.update((s) => ({ ...s, [key]: value }));
  }
}
