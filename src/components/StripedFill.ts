
// Auto-generated from design-system/MochaDS/StripedFill.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'StripedFill',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class StripedFill {
  color1 = input<string>("");
  color2 = input<string>("");
  time = input<number>(0.0);
}
