import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, OnInit, TemplateRef, viewChild } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

type BtnColor = 'default' | 'rose' | 'blue';

@Component({
  imports: [NgTemplateOutlet, RouterLinkWithHref],
  selector: 'app-btn',
  templateUrl: './btn.html',
  styles: `
    :host {
      display: inherit;
    }
  `,
})
export class Btn implements OnInit {
  // DUMMY

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

  protected readonly templateLoaded = computed(() => this._templateDictionary[this.color()]);
}
