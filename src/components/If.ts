
// Auto-generated from ds-qml/qml/MochaDS/If.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'If',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class If {
  condition = input<boolean>(false);
  then = input<unknown>(undefined);
  else = input<unknown>(undefined);
  transition = input<string>("none");
  duration = input<number>(250);
}
