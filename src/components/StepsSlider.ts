// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'StepsSlider', standalone: true,
  host: { '[style.--qml-step.px]': 'currentStep()' },
  template: `<div class="qml-steps-slider"><div class="qml-steps-slider-track"><ng-content></ng-content></div></div>`,
  styles: [`
    :host { display:block; width:400px; height:250px; } .qml-steps-slider { width:100%; height:100%; overflow:hidden; }
    .qml-steps-slider-track { display:flex; width:100%; height:100%; transform:translateX(calc(var(--qml-step, 0) * -100%)); transition:transform 300ms ease-in-out; }
    .qml-steps-slider-track ::ng-deep > * { flex:0 0 100%; width:100%; height:100%; }
  `],
})
export class StepsSlider { currentStep = input<number>(0); }
