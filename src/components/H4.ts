// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'H4',
  standalone: true,
  template: `<h4 class="title title-h4"><ng-content></ng-content></h4>`,
  styles: [`
    :host { display: block; }
    h4 { all: unset; display: block; }
    h4:focus-visible { outline: none; }
  `],
})
export class H4 {
  readonly variant = input<'h4'>('h4');
}
