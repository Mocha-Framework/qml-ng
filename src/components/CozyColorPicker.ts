
// Auto-generated from design-system/MochaDS/CozyColorPicker.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'CozyColorPicker',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CozyColorPicker {
  colorValue = input<string>("#CBA6F7");
  inline = input<boolean>(false);
  disabled = input<boolean>(false);
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
  currentHue = input<number>(0.8);
  currentSaturation = input<number>(0.33);
  currentValue = input<number>(0.97);

  colorChanged = output<{ newHex: string }>();
}
