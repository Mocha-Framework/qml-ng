// Auto-generated from design-system/MochaDS/Stepper.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { StepperComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Stepper',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"stepper"',
  },
  template: `<ng-content></ng-content>`,
})
export class Stepper {
  steps = input<unknown>([]);
  currentStep = input<number>(0);
  orientation = input<string>("horizontal");
  variant = input<string>("default");
  color = input<string>("mauve");


  
}
