
// Auto-generated from design-system/MochaDS/FormController.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'FormController',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class FormController {
  fields = input<unknown>(undefined);
  errors = input<unknown>(undefined);

  validationComplete = output<{ isValid: boolean }>();
  fieldError = output<{ fieldName: string, errorText: string }>();
}
