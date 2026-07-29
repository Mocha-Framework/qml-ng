
// Auto-generated from design-system/MochaDS/TextEditor.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'TextEditor',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TextEditor {
  text = input<string>("");
  placeholder = input<string>("");
  disabled = input<boolean>(false);
  readOnly = input<boolean>(false);
  size = input<string>("md");
  status = input<string>("normal");
  customRadius = input<number>(-1);
  customBorderColor = input<string>("transparent");
  customBackgroundColor = input<string>("transparent");

  textEdited = output<void>();
}
