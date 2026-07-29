
// Auto-generated from design-system/MochaDS/PinInput.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'PinInput',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class PinInput {
  length = input<number>(4);
  text = input<string>("");
  type = input<string>("number");
  mask = input<boolean>(false);
  status = input<string>("normal");
  disabled = input<boolean>(false);
  size = input<string>("md");
  spacing = input<number>(8);
  errorText = input<string>("");
  isInvalid = input<boolean>(false);
  isHovered = input<boolean>(false);

  completed = output<{ code: string }>();
  accepted = output<void>();
  textEdited = output<void>();
}
