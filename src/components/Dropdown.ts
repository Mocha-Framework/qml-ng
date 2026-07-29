// Auto-generated from design-system/MochaDS/Dropdown.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { DropdownComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Dropdown',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"dropdown"',
  },
  template: `<ng-content></ng-content>`,
})
export class Dropdown {
  items = input<unknown>([]);
  placement = input<string>("bottom-start");
  minWidth = input<number>(180);
  isOpen = input<boolean>(false);
  disabled = input<boolean>(false);
  rowData = input<unknown>(undefined);
  isDanger = input<boolean>(false);
  isDisabled = input<boolean>(false);

  itemSelected = output<{ item: unknown }>();

  
}
