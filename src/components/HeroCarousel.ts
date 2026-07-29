
// Auto-generated from design-system/MochaDS/HeroCarousel.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'HeroCarousel',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class HeroCarousel {
  model = input<unknown>([]);
  autoAdvanceInterval = input<number>(5500);
  currentIndex = input<number>(0);

  primaryActionClicked = output<{ index: number, itemData: unknown }>();
  secondaryActionClicked = output<{ index: number, itemData: unknown }>();
}
