
// Auto-generated from design-system/MochaDS/AdvancedTextEditor.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AdvancedTextEditor',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AdvancedTextEditor {
  text = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  readOnly = input<boolean>(false);
  visualMode = input<boolean>(true);
  showToolbar = input<boolean>(true);
  showStatusbar = input<boolean>(true);
  customRadius = input<number>(-1);
  customBorderColor = input<string>("transparent");
  customBackgroundColor = input<string>("transparent");
  icon = input<string>("");
  tooltip = input<string>("");
  active = input<boolean>(false);

  textEdited = output<void>();
  clicked = output<void>();
}
