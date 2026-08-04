
// Auto-generated from ds-qml/qml/MochaDS/EdgeSwipeGesture.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'EdgeSwipeGesture',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class EdgeSwipeGesture {
  edge = input<string>("left");
  bandSize = input<number>(24);
  threshold = input<number>(60);
  hapticOnTrigger = input<boolean>(true);
  enabled = input<boolean>(true);

  edgeSwiped = output<{ edge: string, direction: string }>();
}
