
// Auto-generated from design-system/MochaDS/RadarChart.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'RadarChart',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class RadarChart {
  chartData = input<unknown>([]);
  color = input<string>("");
  maxValue = input<number>(100);
  levels = input<number>(4);
  animated = input<boolean>(true);
  drawProgress = input<number>(0);
}
