
// Auto-generated from design-system/MochaDS/AlertDialog.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'AlertDialog',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AlertDialog {
  dialogType = input<string>("info");
  dialogTitle = input<string>("");
  dialogMessage = input<string>("");
  confirmLabel = input<string>("Confirmar");
  cancelLabel = input<string>("Cancelar");
  showCancel = input<boolean>(true);

  confirmed = output<void>();
  cancelled = output<void>();
}
