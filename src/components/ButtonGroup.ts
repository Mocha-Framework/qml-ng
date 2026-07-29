
// Auto-generated from design-system/MochaDS/ButtonGroup.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ButtonGroup',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ButtonGroup {
  currentIndex = input<number>(0);
  variant = input<string>("default");
  expand = input<boolean>(true);
  itemsList = input<unknown>([]);
}
