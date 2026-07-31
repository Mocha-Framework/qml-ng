// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'H1',
  standalone: true,
  template: `<h1 class="title title-h1"><ng-content></ng-content></h1>`,
  styles: [`
    :host { display: block; }
    h1 { all: unset; display: block; }
    h1:focus-visible { outline: none; }
  `],
})
export class H1 {
  readonly variant = input<'h1'>('h1');
}
