
// Auto-generated from design-system/MochaDS/RadioButton.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'RadioButton',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class RadioButton {
  label = input<string>("");
  value = input<string>("");
  size = input<string>("md");
  checked = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<void>();
}
