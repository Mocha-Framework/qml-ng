
// Auto-generated from design-system/MochaDS/Form.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'qml-form',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Form {
  validateOnInput = input<boolean>(true);

  submitted = output<{ values: unknown }>();
}
