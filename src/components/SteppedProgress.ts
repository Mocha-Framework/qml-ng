
// Auto-generated from design-system/MochaDS/SteppedProgress.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SteppedProgress',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SteppedProgress {
  totalSteps = input<number>(4);
  currentStep = input<number>(1);
  variant = input<string>("primary");
  showStripes = input<boolean>(true);
  animateCurrent = input<boolean>(true);
  spacing = input<number>(4);
  customColor = input<string>("transparent");
  customRadius = input<number>(-1);
}
