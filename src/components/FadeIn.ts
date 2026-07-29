
// Auto-generated from design-system/MochaDS/FadeIn.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'FadeIn',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class FadeIn {
  duration = input<number>(300);
  delay = input<number>(0);
  trigger = input<boolean>(true);
  triggerOnVisibility = input<boolean>(false);
  visibilityThreshold = input<number>(0.3);
}
