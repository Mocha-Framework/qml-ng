
// Auto-generated from design-system/MochaDS/ContextMenu.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ContextMenu',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ContextMenu {
  items = input<unknown>([]);
  open = input<boolean>(false);
  offsetX = input<number>(0);
  offsetY = input<number>(0);

  closed = output<void>();
}
