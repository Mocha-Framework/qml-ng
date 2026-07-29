
// Auto-generated from design-system/MochaDS/SidebarItem.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SidebarItem',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SidebarItem {
  icon = input<string>("");
  label = input<string>("");
  isActive = input<boolean>(false);
  expanded = input<boolean>(false);

  clicked = output<void>();
}
