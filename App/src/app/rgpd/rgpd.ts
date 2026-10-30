import { Component } from '@angular/core';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.html',
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class Rgpd {
  // CTRL
  readonly appName = 'Kübello';
}
