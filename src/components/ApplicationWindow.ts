
// Auto-generated from design-system/MochaDS/ApplicationWindow.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ApplicationWindow',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ApplicationWindow {
  themeMode = input<string>("catppuccin");
  flavor = input<string>("");
  darkTitleBar = input<boolean>(true);
}
