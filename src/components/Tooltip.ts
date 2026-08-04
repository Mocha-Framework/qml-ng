// Auto-generated from ds-qml/qml/MochaDS/Tooltip.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Tooltip',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"tooltip"',
  },
  template: `<ng-content></ng-content>`,
})
export class Tooltip {
  text = input<string>("");
  placement = input<string>("top");
  delay = input<number>(500);
  maxWidth = input<number>(240);
  sz = input<number>(9);


  
}
