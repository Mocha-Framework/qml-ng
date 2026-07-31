// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'H2',
  standalone: true,
  template: `<h2 class="title title-h2"><ng-content></ng-content></h2>`,
  styles: [`
    :host { display: block; }
    h2 { all: unset; display: block; }
    h2:focus-visible { outline: none; }
  `],
})
export class H2 {
  readonly variant = input<'h2'>('h2');
}
