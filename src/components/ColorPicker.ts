
// Auto-generated from design-system/MochaDS/ColorPicker.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ColorPicker',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class ColorPicker {
  selectedColor = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  size = input<string>("md");
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
}
