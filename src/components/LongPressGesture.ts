
// Auto-generated from ds-qml/qml/MochaDS/LongPressGesture.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'LongPressGesture',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class LongPressGesture {
  duration = input<number>(500);
  hapticOnTrigger = input<boolean>(true);
  hapticStyle = input<string>("impactMedium");
  pressed = input<boolean>(false);

  longPressed = output<{ localPos: unknown }>();
  pressStarted = output<void>();
  pressCanceled = output<void>();
}
