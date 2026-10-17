import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, OnInit, TemplateRef, viewChild } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

type BtnColor = 'default' | 'rose' | 'blue';

@Component({
  imports: [NgTemplateOutlet, RouterLinkWithHref],
  selector: 'app-btn',
  styles: `
    :host {
      display: inherit;
    }
  `,
  template: `
    <ng-container [ngTemplateOutlet]="templateLoaded()" [ngTemplateOutletContext]="myContext()">
    </ng-container>

    <ng-template #default let-def let-label="label" let-route="route" let-size="size">
      <a
        class="py-2 px-3 border border-mauve-500/50 rounded-xl hover:-translate-y-1 hover:border-mauve-500 hover:shadow-mauve-500 hover:shadow-sm active:text-rose-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]"
        [routerLink]="route"
      >
        {{ label === '' ? def : label }}
      </a>
    </ng-template>

    <ng-template #blue let-def let-label="label" let-route="route" let-size="size">
      <a
        class="py-2 px-3 border border-blue-500/50 rounded-xl hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-blue-500 hover:shadow-sm active:text-blue-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]"
        [routerLink]="route"
      >
        {{ label === '' ? def : label }}
      </a>
    </ng-template>

    <ng-template #rose let-def let-label="label" let-route="route" let-size="size">
      <a
        class="py-2 px-3 border border-rose-500/50 rounded-xl hover:-translate-y-0.5 hover:border-rose-500 hover:shadow-rose-500 hover:shadow-sm active:text-rose-500 transition-all duration-250 animate-[fade-in_1.5s_ease-in_1s_normal_backwards]"
        [routerLink]="route"
      >
        {{ label === '' ? def : label }}
      </a>
    </ng-template>
  `,
})
export class Btn implements OnInit {
  // DUMMY CTRL

  readonly route = input.required<string>();
  readonly label = input.required<string>();
  readonly color = input<BtnColor>('default');

  protected readonly myContext = computed(() => ({
    $implicit: 'Click!',
    label: this.label(),
    route: this.route(),
  }));

  private readonly _templateRefRose = viewChild.required<TemplateRef<unknown>>('rose');
  private readonly _templateRefBlue = viewChild.required<TemplateRef<unknown>>('blue');
  private readonly _templateRefDefault = viewChild.required<TemplateRef<unknown>>('default');
  //...

  private _templateDictionary: Record<string, TemplateRef<unknown>> = {};

  ngOnInit(): void {
    this._templateDictionary = {
      default: this._templateRefDefault(),
      rose: this._templateRefRose(),
      blue: this._templateRefBlue(),
      //...
    };
  }

  protected readonly templateLoaded = computed<TemplateRef<unknown>>(
    () => this._templateDictionary[this.color()],
  );
}
