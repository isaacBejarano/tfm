import { Component } from '@angular/core';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.html',
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class Copyright {
  // CTRL
  readonly appName = 'Kübello';
}
