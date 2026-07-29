
// Auto-generated from design-system/MochaDS/NavigationItem.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'NavigationItem',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class NavigationItem {
  iconName = input<string>("");
  label = input<string>("");
  expandingProgress = input<number>(0);
}
