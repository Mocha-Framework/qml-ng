
// Auto-generated from ds-qml/qml/MochaDS/PullToRefreshGesture.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'PullToRefreshGesture',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class PullToRefreshGesture {
  target = input<unknown>("null");
  threshold = input<number>(80);
  hapticOnTrigger = input<boolean>(true);
  enabled = input<boolean>(true);
  refreshing = input<boolean>(false);

  refresh = output<void>();
  progressChanged = output<{ progress: number }>();
}
