
// Auto-generated from design-system/MochaDS/AnimatedPresence.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AnimatedPresence',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AnimatedPresence {
  shown = input<boolean>(false);
  enterDuration = input<number>(300);
  exitDuration = input<number>(250);
  enterOffset = input<number>(20);
  exitOffset = input<number>(20);
  enterFromScale = input<number>(0.92);
  exitToScale = input<number>(0.92);
  enterAnimation = input<string>("fade");
  exitAnimation = input<string>("fade");
}
