import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div
      role="status"
      aria-label="Cargando..."
      class="w-dvw h-dvh flex justify-center items-start border border-blue-600/25 bg-rose-600/5"
    >
      <div class="loader mt-3 w-[70px] text-rose-500"></div>
    </div>
  `,
})
export class Loader {}
