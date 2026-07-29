
// Auto-generated from design-system/MochaDS/LineChart.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'LineChart',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class LineChart {
  chartData = input<unknown>([]);
  lineColor = input<string>("");
  fillArea = input<boolean>(true);
  maxValue = input<number>(-1);
  gridLines = input<number>(4);
  smooth = input<boolean>(true);
  animated = input<boolean>(true);
  drawProgress = input<number>(0);
  hoverIndex = input<number>(-1);
}
