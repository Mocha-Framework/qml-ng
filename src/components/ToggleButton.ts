
// Auto-generated from design-system/MochaDS/ToggleButton.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ToggleButton',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ToggleButton {
  checked = input<boolean>(false);
  label = input<string>("");
  disabled = input<boolean>(false);

  toggled = output<{ state: boolean }>();
}
