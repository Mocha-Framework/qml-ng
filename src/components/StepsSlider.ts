// Auto-generated from design-system/MochaDS/StepsSlider.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { StepsSliderComponent } from '@mocha-ds/angular';

@Component({
  selector: 'StepsSlider',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"stepsslider"',
  },
  template: `<ng-content></ng-content>`,
})
export class StepsSlider {
  currentStep = input<number>(0);


  
}
