
// Auto-generated from design-system/MochaDS/ChartTooltip.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ChartTooltip',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ChartTooltip {
  title = input<string>("");
  items = input<unknown>([]);
  placement = input<string>("top");
  showTooltip = input<boolean>(false);
}
