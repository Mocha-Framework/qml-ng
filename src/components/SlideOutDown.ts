
// Auto-generated from design-system/MochaDS/SlideOutDown.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SlideOutDown',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SlideOutDown {
  duration = input<number>(350);
  delay = input<number>(0);
  offset = input<number>(20);
  trigger = input<boolean>(true);
}
