
// Auto-generated from design-system/MochaDS/Separator.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Separator',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Separator {
  orientation = input<string>("horizontal");
  variant = input<string>("default");
  thickness = input<number>(1);
  margin = input<number>(0);
}
