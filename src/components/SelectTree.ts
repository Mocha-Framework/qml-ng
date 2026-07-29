
// Auto-generated from design-system/MochaDS/SelectTree.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'SelectTree',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class SelectTree {
  options = input<unknown>([]);
  selectedValue = input<unknown>(null);
  selectedLabel = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  size = input<string>("md");
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
  expandedNodes = input<unknown>(undefined);
  flatList = input<unknown>([]);

  valueChanged = output<{ val: unknown }>();
}
