
// Auto-generated from design-system/MochaDS/BarChart.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'BarChart',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class BarChart {
  chartData = input<unknown>([]);
  colors = input<unknown>("[");
  maxValue = input<number>(-1);
  gridLines = input<number>(4);
  animated = input<boolean>(true);
  animatedHeight = input<number>(0);
}
