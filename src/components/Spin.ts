
// Auto-generated from design-system/MochaDS/Spin.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Spin',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Spin {
  duration = input<number>(500);
  delay = input<number>(0);
  fromRotation = input<number>(-180);
  trigger = input<boolean>(true);
}
