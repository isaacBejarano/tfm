import { Component } from '@angular/core';
import { Btn } from '@shared/components/btn/btn';

@Component({
  imports: [Btn],
  selector: 'app-footer',
  template: `
    <footer class="bg-mist-950/50 border border-mist-900/75">
      <nav
        class="max-w-(--w-desktop) mx-auto p-3 2xl:p-2 flex flex-wrap justify-center gap-8 text-[min(10dvw,12px)] 2xl:text-[min(10dvw,1rem)]"
      >
        <app-btn label="Política de Protección de Datos" route="rgpd" [css]="btnGray" />
        <app-btn label="Política de Cookies" route="cookies" [css]="btnGray" />
      </nav>
    </footer>
  `,
})
export class Footer {
  // DUMMY
  readonly btnGray: string = Btn.style('gray');
}
