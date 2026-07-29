
// Auto-generated from design-system/MochaDS/MochaMap.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'MochaMap',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MochaMap {
  items = input<unknown>([]);
  delegate = input<unknown>("null");
  spacing = input<number>(0);
  orientation = input<string>("vertical");
  modelData = input<unknown>(undefined);
  index = input<number>(0);
}
