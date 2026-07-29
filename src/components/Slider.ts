// Auto-generated from design-system/MochaDS/Slider.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { SliderComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Slider',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"slider"',
  },
  template: `<ng-content></ng-content>`,
})
export class Slider {
  value = input<number>(0);
  minimum = input<number>(0);
  maximum = input<number>(100);
  step = input<number>(1);
  disabled = input<boolean>(false);
  size = input<string>("md");


  
}
