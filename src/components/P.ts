// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'P',
  standalone: true,
  template: `<p class="text text-body"><ng-content></ng-content></p>`,
  styles: [`
    :host { display: block; }
    p { all: unset; display: block; }
    p:focus-visible { outline: none; }
  `],
})
export class P {
  readonly variant = input<'body'>('body');
}
