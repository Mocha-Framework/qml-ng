
// Auto-generated from design-system/MochaDS/PieChart.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'PieChart',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class PieChart {
  chartData = input<unknown>([]);
  colors = input<unknown>("[");
  animated = input<boolean>(true);
  donutRatio = input<number>(0.0);
  drawProgress = input<number>(0);
  hoverIndex = input<number>(-1);
}
