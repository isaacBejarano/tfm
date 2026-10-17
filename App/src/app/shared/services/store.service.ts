import { computed, Service, signal } from '@angular/core';
import { FormAuth } from '../types/forms-auth.type';

export type Store = {
  formAuth: FormAuth;
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
