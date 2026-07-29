
// Auto-generated from design-system/MochaDS/AnimatedNumber.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AnimatedNumber',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AnimatedNumber {
  value = input<number>(0);
  from = input<number>(0);
  animated = input<boolean>(true);
  duration = input<number>(800);
  easing = input<string>("OutQuart");
  prefix = input<string>("");
  suffix = input<string>("");
  decimalPlaces = input<number>(0);
  separator = input<string>("");
}
