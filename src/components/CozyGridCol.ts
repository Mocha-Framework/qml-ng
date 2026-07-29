
// Auto-generated from design-system/MochaDS/CozyGridCol.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'CozyGridCol',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CozyGridCol {
  span = input<number>(12);
  sm = input<number>(-1);
  md = input<number>(-1);
  lg = input<number>(-1);
  offset = input<number>(0);
  smOffset = input<number>(-1);
  mdOffset = input<number>(-1);
  lgOffset = input<number>(-1);
  alignSelf = input<string>("");
  order = input<number>(0);
}
