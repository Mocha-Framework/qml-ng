// Auto-generated from ds-qml/qml/MochaDS/DynamicForm.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'DynamicForm',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"dynamicform"',
  },
  template: `<ng-content></ng-content>`,
})
export class DynamicForm {
  schema = input<unknown>([]);
  formValues = input<unknown>(undefined);
  formErrors = input<unknown>(undefined);
  formStatuses = input<unknown>(undefined);

  submitted = output<{ values: unknown }>();

  
}
