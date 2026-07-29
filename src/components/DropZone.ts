
// Auto-generated from design-system/MochaDS/DropZone.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'DropZone',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DropZone {
  key = input<string>("");
  accentColor = input<string>("");
  highlightOpacity = input<number>(0.15);
  borderOpacity = input<number>(0.4);
  radius = input<number>(12);
  forceHighlight = input<boolean>(false);

  entered = output<{ source: unknown }>();
  exited = output<{ source: unknown }>();
  dropped = output<{ source: unknown }>();
}
