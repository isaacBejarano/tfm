import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <h1 class="p-1 mt-4 m-auto w-xs border border-pink-700/75 rounded-sm">{{ title() }}</h1>

    <main>
      <router-outlet />
    </main>
  `,
})
export class App {
  protected readonly title = signal('Kübello');
}
