
// Auto-generated from design-system/MochaDS/GaugeChart.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'GaugeChart',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class GaugeChart {
  value = input<number>(0.0);
  label = input<string>("");
  unit = input<string>("%");
  color = input<string>("");
  animated = input<boolean>(true);
  drawProgress = input<number>(0);
}
