import { Component, input, output } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-btn',
  imports: [RouterLinkWithHref],
  template: `
    <button
      [type]="type()"
      [aria-label]="ariaLabel()"
      [disabled]="disabled()"
      [routerLink]="route()"
      [class]="css()"
      (click)="onClick($event)"
    >
      <span>
        {{ label() }}
      </span>
      <ng-content></ng-content>
    </button>
  `,
})
export class Btn {
  // DUMMY

  // I/O
  readonly type = input<'button' | 'submit'>('button');
  readonly ariaLabel = input<string>(); // for btn without text (e.g. with icons only)
  readonly disabled = input<boolean>(false);
  readonly label = input<string>();
  readonly route = input<string>();
  readonly css = input<string>();
  protected readonly $click = output<void>();

  protected onClick(e: Event) {
    e.stopPropagation();
    this.$click.emit();
  }

  static style(color: 'gray' | 'rose' | 'blue' | 'green' | 'red', shape: 'slim' = 'slim'): string {
    return {
      slim: {
        gray: 'py-2 px-3 cursor-pointer border border-mauve-500/50 rounded-xl hover:-translate-y-1 hover:border-mauve-500 hover:shadow-mauve-500 hover:shadow-sm active:text-rose-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]',
        rose: 'py-2 px-3 cursor-pointer border border-rose-500/50 rounded-xl hover:-translate-y-0.5 hover:border-rose-500 hover:shadow-rose-500 hover:shadow-sm active:text-rose-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]',
        blue: 'py-2 px-3 cursor-pointer border border-blue-500/50 rounded-xl hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-blue-500 hover:shadow-sm active:text-blue-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]',
        green:
          'py-2 px-3 cursor-pointer border border-green-500/50 rounded-xl hover:-translate-y-0.5 hover:border-green-500 hover:shadow-green-500 hover:shadow-sm active:text-green-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]',
        red: 'py-2 px-3 cursor-pointer border border-red-500/50 rounded-xl hover:-translate-y-0.5 hover:border-red-500 hover:shadow-red-500 hover:shadow-sm active:text-red-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]',
      },
      //...
    }[shape][color];
  }
}
