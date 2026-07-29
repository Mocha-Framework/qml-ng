
// Auto-generated from design-system/MochaDS/SlideUp.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SlideUp',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SlideUp {
  duration = input<number>(400);
  delay = input<number>(0);
  offset = input<number>(20);
  trigger = input<boolean>(true);
  triggerOnVisibility = input<boolean>(false);
  visibilityThreshold = input<number>(0.3);
}
