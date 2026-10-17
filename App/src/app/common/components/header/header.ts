import { Component, input, signal } from '@angular/core';
import { Btn } from '@shared/components/btn/btn';

@Component({
  imports: [Btn],
  selector: 'app-header',
  styles: ``,
  template: `
    <!-- PUBLIC -->
    @if (isRoutePublic()) {
      <div class="max-w-(--w-desktop) mx-auto p-2">
        <!-- BRAND -->
        <header class="flex md:gap-8 justify-between">
          <!-- icon -->
          <div
            class="size-[45px] md:size-[50px] 2xl:size-[70px] self-center bg-[url(/img/favicon.webp)] bg-no-repeat bg-contain inset-shadow-sm inset-shadow-black animate-fade-in"
          ></div>

          <!-- logo -->
          <div
            class="w-[205px] h-[50px] 2xl:w-[270px] 2xl:h-[80px] bg-[url(/img/logo-clip.webp)] bg-clip-text bg-top text-5xl 2xl:text-7xl text-transparent font-black animate-[fade-in_1s_ease-in_1.5s_normal_backwards]"
          >
            {{ legend() }}
          </div>

          <!-- wildcard slot -->
          <div class="w-[50px] h-[50px]"></div>
        </header>

        <!-- TOP MENU PUBLIC -->
        <nav class="mt-3 p-3 2xl:p-2 flex justify-center gap-8">
          <app-btn route="/" label="Acceso" color="rose" />
          <app-btn route="/" label="¡Regístrate!" color="blue" />
        </nav>
      </div>
    }
    <!-- PRIVATE -->
    @else {
      <div class="max-w-(--w-desktop) mx-auto p-2">
        <!-- BRAND -->
        <header class="flex md:gap-8">
          <!-- icon -->
          <div
            class="size-[35px] self-center bg-[url(/img/favicon.webp)] bg-no-repeat bg-contain inset-shadow-sm inset-shadow-black animate-fade-in"
          ></div>

          <!-- TOP MENU PRIVATE -->
          <nav
            class="ml-4 p-2 flex justify-center gap-8 text-[min(10dvw,12px)] 2xl:text-[min(10dvw,1rem)]"
          >
            <!-- TODO: admin roles are only for maintenance, they have no agenda. Tohave one: log in as 'user'  -->
            @if (role() === 'user') {
              <app-btn route="/" label="Agenda" color="rose" />
            }
            <!-- TODO: INE selector @profile -->
            <app-btn route="/" label="Perfil" color="rose" />
            @if (role() !== 'user') {
              <app-btn route="/" label="Usuarios" color="blue" />
            }
          </nav>
        </header>

        <!-- TOP MENU -->
      </div>
    }
  `,
})
export class Header {
  // DUMMY CTRL
  readonly legend = input.required<string>();

  // TODO: rouer + user claims
  readonly role = signal<'user' | 'admin' | 'super'>('user');
  readonly isRoutePublic = signal<boolean>(false);
}
