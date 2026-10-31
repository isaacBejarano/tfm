import { Component } from '@angular/core';
import { Btn } from '@shared/components/btn/btn';

@Component({
  imports: [Btn],
  selector: 'app-footer',
  template: `
    <footer
      class="bg-mist-950/50 border border-mist-900/75 text-[min(10dvw,12px)] 2xl:text-[min(10dvw,1rem)]"
    >
      <nav
        class="max-w-(--w-desktop) mx-auto p-3 2xl:p-2 flex flex-wrap justify-center gap-4 2xl:gap-6"
      >
        <app-btn label="Política de Protección de Datos" route="rgpd" [css]="btnGray" />
        <app-btn label="Política de Cookies" route="cookies" [css]="btnGray" />
        <app-btn label="Propiedad Intelectual" route="copyright" [css]="btnGray" />
      </nav>

      <small class="py-2 text-xs block text-center">
        Copyright (c) {{ year }} Isaac Bejarano
      </small>
    </footer>
  `,
})
export class Footer {
  protected readonly btnGray: string = Btn.style('gray', 'outline', 'normal', [
    'raise',
    'fade',
    '3d-gray',
  ]); // DUMMY

  protected readonly year: string = new Date().getFullYear().toString();
}
