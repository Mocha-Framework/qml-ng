// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'H3',
  standalone: true,
  template: `<h3 class="title title-h3"><ng-content></ng-content></h3>`,
  styles: [`
    :host { display: block; }
    h3 { all: unset; display: block; }
    h3:focus-visible { outline: none; }
  `],
})
export class H3 {
  readonly variant = input<'h3'>('h3');
}
