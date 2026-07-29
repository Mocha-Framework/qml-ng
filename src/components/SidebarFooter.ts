
// Auto-generated from design-system/MochaDS/SidebarFooter.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SidebarFooter',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SidebarFooter {
  username = input<string>("");
  email = input<string>("");
  avatarIcon = input<string>("user");
}
