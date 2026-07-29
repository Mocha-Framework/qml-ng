
// Auto-generated from design-system/MochaDS/GlowPulse.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'GlowPulse',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class GlowPulse {
  color = input<string>("");
  pulseMin = input<number>(0.3);
  pulseMax = input<number>(1.0);
  duration = input<number>(1500);
}
