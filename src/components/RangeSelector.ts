
// Auto-generated from design-system/MochaDS/RangeSelector.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'RangeSelector',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class RangeSelector {
  min = input<number>(0);
  max = input<number>(100);
  firstValue = input<number>(20);
  secondValue = input<number>(80);
  step = input<number>(1);
  disabled = input<boolean>(false);
  showFirstThumb = input<boolean>(true);
  onChange = input<unknown>(null);
  activeThumb = input<number>(0);

  valuesChanged = output<{ first: number, second: number }>();
}
