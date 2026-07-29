// Auto-generated from design-system/MochaDS/Steps.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { StepsComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Steps',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"steps"',
  },
  template: `<ng-content></ng-content>`,
})
export class Steps {
  currentStep = input<number>(0);
  stepsCount = input<number>(3);
  labels = input<unknown>([]);
  variant = input<string>("timeline");
  color = input<string>("mauve");
  orientation = input<string>("horizontal");

  changeStep = output<{ step: number }>();

  
}
