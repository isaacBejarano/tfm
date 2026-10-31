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
  // I/O
  readonly type = input<'button' | 'submit'>('button');
  readonly ariaLabel = input<string>(); // for btn without text (e.g. with icons only)
  readonly disabled = input<boolean>(false);
  readonly label = input<string>();
  readonly route = input<string>();
  readonly css = input<string>();
  protected readonly $click = output<void>();

  // DUMMY
  ////

  protected onClick(e: Event) {
    e.stopPropagation();
    this.$click.emit();
  }

  static readonly borderColors = {
    gray: 'border-mauve-500/50',
    rose: 'border-rose-500/50',
    blue: 'border-blue-500/50',
    red: 'border-red-500/50',
    green: 'border-green-500/50',
  };

  static style(
    color: 'gray' | 'rose' | 'blue' | 'green' | 'red',
    look: 'outline' | 'transparent' = 'outline',
    shape: 'normal' | 'slim' = 'normal',
    effects: ('raise' | 'fade' | '3d-rose' | '3d-blue' | '3d-gray' | '3d-green' | '3d-red')[] = [
      'raise',
    ],
  ): string {
    const colors = {
      gray: `${Btn.borderColors['gray']} hover:border-mauve-500 hover:shadow-mauve-500 hover:shadow-sm active:text-white text-mist-300 hover:text-mist-200`,
      rose: `${Btn.borderColors['rose']} border-rose-500/50 hover:border-rose-500 hover:shadow-rose-500 hover:shadow-sm active:text-rose-500`,
      blue: `${Btn.borderColors['blue']} border-blue-500/50 hover:border-blue-500 hover:shadow-blue-500 hover:shadow-sm active:text-blue-500`,
      green: `${Btn.borderColors['green']} hover:border-green-500 hover:shadow-green-500 hover:shadow-sm active:text-green-500`,
      red: `${Btn.borderColors['red']} hover:border-red-500 hover:shadow-red-500 hover:shadow-sm active:text-red-500`,
    };

    const looks = {
      outline: 'border rounded-xl',
      transparent: 'rounded-xl',
      // solid...
    };

    const shapes = {
      normal: 'px-3 py-2',
      slim: 'px-2 py-1',
      // slim, fat...
    };

    const effectAssoc = [
      ['raise', 'transition-all duration-250 hover:-translate-y-0.5'], // hover
      ['fade', 'transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]'],
      [
        '3d-rose',
        'shadow-sm inset-shadow-[0_1px_0_#ffffff46,0_-2px_0_rgb(0_0_0_/_50%),0_8px_20px_-6px_#851631]',
      ],
      [
        '3d-blue',
        'shadow-sm inset-shadow-[0_1px_0_#ffffff46,0_-2px_0_rgb(0_0_0_/_50%),0_8px_20px_-6px_#1b4688]',
      ],
      [
        '3d-gray',
        'shadow-sm inset-shadow-[0_1px_0_#ffffff46,0_-2px_0_rgb(0_0_0_/_50%),0_8px_20px_-6px_#79697b]',
      ],
      [
        '3d-green',
        'shadow-sm inset-shadow-[0_1px_0_#ffffff46,0_-2px_0_rgb(0_0_0_/_50%),0_8px_20px_-6px_#00c951]',
      ],
      [
        '3d-red',
        'shadow-sm inset-shadow-[0_1px_0_#ffffff46,0_-2px_0_rgb(0_0_0_/_50%),0_8px_20px_-6px_#fb2c36]',
      ],
      // none...
    ];

    const fxToString: string = effects
      .map((fx) => effectAssoc.find((assoc) => assoc[0] === fx))
      .map((assoc) => (assoc ? assoc[1] : ''))
      .join(' ');

    return `cursor-pointer ${colors[color]} ${looks[look]} ${shapes[shape]} ${fxToString}`;
  }
}
