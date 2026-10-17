import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, OnInit, output, TemplateRef, viewChild } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { BtnColor } from '@shared/components/btn/btn-color.type';

@Component({
  imports: [NgTemplateOutlet, RouterLinkWithHref],
  selector: 'app-btn',
  styles: `
    :host {
      display: inherit;
    }
  `,
  templateUrl: './btn.html',
  host: { '(click)': '$event.stopPropagation(); onClick()' },
})
export class Btn implements OnInit {
  // DUMMY CTRL
  ////

  readonly type = input.required<'button' | 'submit'>();
  readonly ariaLabel = input<string>('Botón'); // for icon btn without text
  readonly disabled = input<boolean>(false); // required, etc.
  readonly label = input<string>();
  readonly route = input<string>('#');
  readonly color = input<BtnColor>('default');

  protected readonly $click = output<'submit' | 'button'>(); // $focus, etc.

  protected readonly myContext = computed(() => ({
    $implicit: '¡Presionar',
    type: this.type(),
    disabled: this.disabled(),
    ariaLabel: this.ariaLabel(),
    label: this.label(),
    route: this.route(),
  }));

  private readonly _templateRefDefault = viewChild.required<TemplateRef<unknown>>('default');
  private readonly _templateRefRose = viewChild.required<TemplateRef<unknown>>('rose');
  private readonly _templateRefBlue = viewChild.required<TemplateRef<unknown>>('blue');
  private readonly _templateRefGreen = viewChild.required<TemplateRef<unknown>>('green');
  private readonly _templateRefRed = viewChild.required<TemplateRef<unknown>>('red');
  //...

  private _colorSelector: Record<string, TemplateRef<unknown>> = {};

  ngOnInit(): void {
    this._colorSelector = {
      default: this._templateRefDefault(),
      rose: this._templateRefRose(),
      blue: this._templateRefBlue(),
      green: this._templateRefGreen(),
      red: this._templateRefRed(),
      //...
    };
  }

  protected readonly templateLoaded = computed<TemplateRef<unknown>>(
    () => this._colorSelector[this.color()],
  );

  protected onClick() {
    this.$click.emit(this.type());
  }
}
