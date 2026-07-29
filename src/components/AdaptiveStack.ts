
// Auto-generated from design-system/MochaDS/AdaptiveStack.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AdaptiveStack',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AdaptiveStack {
  direction = input<string>("horizontal");
  spacing = input<number>(12);
  justifyContent = input<string>("start");
  alignItems = input<string>("center");
  horizontalBreakpoint = input<string>("md");
}
