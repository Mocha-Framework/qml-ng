// Auto-generated from design-system/MochaDS/Avatar.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { AvatarComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Avatar',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"avatar"',
  },
  template: `<ng-content></ng-content>`,
})
export class Avatar {
  src = input<string>("");
  name = input<string>("");
  size = input<string>("md");
  shape = input<string>("circle");
  variant = input<string>("default");
  showStatus = input<boolean>(false);
  isOnline = input<boolean>(false);
  statusColor = input<string>("");


  
}
