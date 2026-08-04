
// Auto-generated from ds-qml/qml/MochaDS/PinchGesture.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'PinchGesture',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class PinchGesture {
  minScale = input<number>(1.0);
  maxScale = input<number>(4.0);
  hapticOnBounds = input<boolean>(true);
  respectReducedMotion = input<boolean>(true);
  currentScale = input<number>(1.0);
  baseScale = input<number>(1.0);

  pinchStarted = output<void>();
  pinchUpdated = output<{ scale: number, center: unknown, rotation: number }>();
  pinchFinished = output<{ scale: number, center: unknown }>();
}
