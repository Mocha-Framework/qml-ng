// Auto-generated from design-system/MochaDS/Popover.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { PopoverComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Popover',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"popover"',
  },
  template: `<ng-content></ng-content>`,
})
export class Popover {
  placement = input<string>("bottom");
  isOpen = input<boolean>(false);
  disabled = input<boolean>(false);


  
}
