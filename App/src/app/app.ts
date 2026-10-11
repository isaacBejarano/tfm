import { Component, signal } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLinkWithHref],
  selector: 'app-root',
  templateUrl: './app.html',
})
// implements OnInit
export class App {
  // CTRL
  readonly title = signal('Kübello');
}
