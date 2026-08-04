
// Auto-generated from ds-qml/qml/MochaDS/SwipeGesture.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SwipeGesture',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SwipeGesture {
  enabledDirections = input<unknown>(undefined);
  threshold = input<number>(80);
  velocityThreshold = input<number>(600);
  axis = input<number>(0);
  enabled = input<boolean>(true);
  consumeEvents = input<boolean>(true);
  active = input<boolean>(false);
  lastDirection = input<string>("none");
  lastProgress = input<number>(0.0);

  swiped = output<{ direction: string, velocity: number }>();
  swipeProgress = output<{ direction: string, progress: number }>();
  swipeCanceled = output<void>();
}
