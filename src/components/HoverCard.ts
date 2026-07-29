// Auto-generated from design-system/MochaDS/HoverCard.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { HoverCardComponent } from '@mocha-ds/angular';

@Component({
  selector: 'HoverCard',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"hovercard"',
  },
  template: `<ng-content></ng-content>`,
})
export class HoverCard {
  placement = input<string>("top");
  openDelay = input<number>(300);
  closeDelay = input<number>(300);
  disabled = input<boolean>(false);


  
}
