
// Auto-generated from design-system/MochaDS/Draggable.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Draggable',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Draggable {
  key = input<string>("");
  dragData = input<unknown>(null);
  threshold = input<number>(8);
  dragScale = input<number>(1.05);
  dragOpacity = input<number>(0.9);
  elevation = input<number>(6);
  radius = input<number>(-1);
  moves = input<boolean>(false);
  axis = input<number>(0);

  dragStarted = output<{ data: unknown }>();
  dragEnded = output<{ data: unknown }>();
  clicked = output<void>();
}
