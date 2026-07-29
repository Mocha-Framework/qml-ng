
// Auto-generated from design-system/MochaDS/SlideOutUp.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SlideOutUp',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SlideOutUp {
  duration = input<number>(350);
  delay = input<number>(0);
  offset = input<number>(20);
  trigger = input<boolean>(true);
}
