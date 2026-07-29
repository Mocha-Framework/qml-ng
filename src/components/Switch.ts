// Auto-generated from design-system/MochaDS/Switch.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { SwitchComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Switch',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"switch"',
  },
  template: `<ng-content></ng-content>`,
})
export class Switch {
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  size = input<string>("md");
  label = input<string>("");

  toggled = output<{ checked: boolean }>();

  
}
