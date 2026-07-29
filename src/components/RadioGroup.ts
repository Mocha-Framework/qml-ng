
// Auto-generated from design-system/MochaDS/RadioGroup.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'RadioGroup',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class RadioGroup {
  selectedValue = input<string>("");
  direction = input<string>("vertical");
  spacing = input<number>(12);
}
