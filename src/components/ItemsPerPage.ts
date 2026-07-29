
// Auto-generated from design-system/MochaDS/ItemsPerPage.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ItemsPerPage',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ItemsPerPage {
  pageSize = input<number>(10);
  options = input<unknown>(undefined);
  disabled = input<boolean>(false);
  size = input<string>("sm");
}
