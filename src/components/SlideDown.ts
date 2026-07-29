
// Auto-generated from design-system/MochaDS/SlideDown.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SlideDown',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SlideDown {
  duration = input<number>(400);
  delay = input<number>(0);
  offset = input<number>(20);
  trigger = input<boolean>(true);
}
