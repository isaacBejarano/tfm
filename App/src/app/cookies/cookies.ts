import { Component } from '@angular/core';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.html',
  styles: `
    :host {
      display: block;
      margin: auto;
      max-width: var(--w-tablet);
    }
  `,
})
export class Cookies {
  // CTRL
  readonly appName = 'Kübello';
}
