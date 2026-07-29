// Auto-generated from design-system/MochaDS/Toast.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { ToasterComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Toast',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"toast"',
  },
  template: `<ng-content></ng-content>`,
})
export class Toast {
  title = input<string>("");
  message = input<string>("");
  type = input<string>("info");
  duration = input<number>(3000);
  showClose = input<boolean>(true);
  remainingTime = input<number>(0);

  dismissed = output<void>();

  
}
