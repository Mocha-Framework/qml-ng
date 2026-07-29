
// Auto-generated from design-system/MochaDS/EmptyState.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'EmptyState',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class EmptyState {
  icon = input<string>("inbox");
  title = input<string>("");
  description = input<string>("");
  size = input<string>("md");
}
