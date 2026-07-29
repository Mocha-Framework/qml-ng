// Auto-generated from design-system/MochaDS/Select.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { SelectComponent } from '@mocha-ds/angular';

@Component({
  selector: 'qml-select',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"select"',
  },
  template: `<ng-content></ng-content>`,
})
export class Select {
  options = input<unknown>([]);
  selectedValue = input<unknown>(null);
  selectedLabel = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  size = input<string>("md");
  status = input<string>("normal");
  errorText = input<string>("");
  isInvalid = input<boolean>(false);
  expanded = input<boolean>(false);
  openUpward = input<boolean>(false);
  customRadius = input<number>(-1);
  customBorderColor = input<string>("transparent");
  customBackgroundColor = input<string>("transparent");

  valueChanged = output<{ val: unknown }>();

  
}
