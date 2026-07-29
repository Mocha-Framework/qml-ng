
// Auto-generated from design-system/MochaDS/SidebarHeader.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SidebarHeader',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SidebarHeader {
  title = input<string>("");
  subtitle = input<string>("");
  logoIcon = input<string>("");
}
