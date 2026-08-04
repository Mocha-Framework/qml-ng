
// Auto-generated from ds-qml/qml/MochaDS/ButtonGroupItem.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ButtonGroupItem',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ButtonGroupItem {
  text = input<string>("");
  iconName = input<string>("");
  badgeText = input<string>("");

  clicked = output<void>();
}
