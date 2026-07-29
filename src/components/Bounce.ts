
// Auto-generated from design-system/MochaDS/Bounce.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Bounce',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Bounce {
  duration = input<number>(600);
  delay = input<number>(0);
  fromScale = input<number>(0.5);
  trigger = input<boolean>(true);
}
