
// Auto-generated from design-system/MochaDS/NavigationBar.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'NavigationBar',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class NavigationBar {
  variant = input<string>("standard");
  currentIndex = input<number>(0);
  highlightColor = input<string>("");
  darkMode = input<boolean>(true);
  itemsList = input<unknown>([]);
}
