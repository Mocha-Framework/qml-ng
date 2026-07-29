// Auto-generated from design-system/MochaDS/Drawer.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { DrawerComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Drawer',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"drawer"',
  },
  template: `<ng-content></ng-content>`,
})
export class Drawer {
  open = input<boolean>(false);
  title = input<string>("");
  subtitle = input<string>("");
  position = input<string>("right");
  size = input<number>(360);
  closeOnBackdropClick = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  usePortal = input<boolean>(true);
  customRadius = input<number>(-1);

  opened = output<void>();
  closed = output<void>();

  
}
