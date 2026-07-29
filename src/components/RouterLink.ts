
// Auto-generated from design-system/MochaDS/RouterLink.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'RouterLink',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class RouterLink {
  to = input<string>("");
  params = input<unknown>(undefined);
  router = input<unknown>(null);
  action = input<string>("push");
  text = input<string>("");
  icon = input<string>("");
  activeColor = input<string>("");
  inactiveColor = input<string>("");
}
