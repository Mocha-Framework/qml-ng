
// Auto-generated from design-system/MochaDS/ZoomIn.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ZoomIn',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ZoomIn {
  duration = input<number>(350);
  delay = input<number>(0);
  fromScale = input<number>(0.8);
  trigger = input<boolean>(true);
  triggerOnVisibility = input<boolean>(false);
  visibilityThreshold = input<number>(0.3);
}
