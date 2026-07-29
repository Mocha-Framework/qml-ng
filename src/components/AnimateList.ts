
// Auto-generated from design-system/MochaDS/AnimateList.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AnimateList',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AnimateList {
  model = input<unknown>(null);
  delegate = input<unknown>("null");
  animation = input<string>("fade");
  duration = input<number>(300);
  perItemDelay = input<number>(60);
  trigger = input<boolean>(true);
  offset = input<number>(20);
  fromScale = input<number>(0.8);
  itemIndex = input<number>(0);
}
