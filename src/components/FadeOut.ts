
// Auto-generated from design-system/MochaDS/FadeOut.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'FadeOut',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class FadeOut {
  duration = input<number>(300);
  delay = input<number>(0);
  trigger = input<boolean>(true);
}
