
// Auto-generated from design-system/MochaDS/CozyGrid.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'CozyGrid',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CozyGrid {
  mobile = input<boolean>(false);
  multiline = input<boolean>(true);
  gap = input<number>(3);
  align = input<string>("start");
  valign = input<string>("start");
  model = input<unknown>(null);
  delegate = input<unknown>("null");
  layoutHeight = input<number>(0);
}
