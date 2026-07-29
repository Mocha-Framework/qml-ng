
// Auto-generated from design-system/MochaDS/MediaQuery.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'MediaQuery',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MediaQuery {
  windowWidth = input<number>(0);
  windowHeight = input<number>(0);
  breakpoints = input<unknown>(undefined);
}
