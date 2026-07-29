
// Auto-generated from design-system/MochaDS/Particles.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Particles',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Particles {
  count = input<number>(15);
  color = input<string>("");
  minSize = input<number>(2);
  maxSize = input<number>(6);
  duration = input<number>(3000);
  spread = input<number>(100);
  running = input<boolean>(true);
  size = input<number>(0);
  startX = input<number>(0);
  startY = input<number>(0);
  endX = input<number>(0);
  endY = input<number>(0);
  randomDelay = input<number>(0);
  randomDuration = input<number>(0);
}
