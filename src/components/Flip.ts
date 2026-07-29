
// Auto-generated from design-system/MochaDS/Flip.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Flip',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Flip {
  duration = input<number>(500);
  delay = input<number>(0);
  clockwise = input<boolean>(false);
  trigger = input<boolean>(true);
}
