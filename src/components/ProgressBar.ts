// Auto-generated from design-system/MochaDS/ProgressBar.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { ProgressBarComponent } from '@mocha-ds/angular';

@Component({
  selector: 'ProgressBar',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"progressbar"',
  },
  template: `<ng-content></ng-content>`,
})
export class ProgressBar {
  value = input<number>(0.0);
  label = input<string>("");
  variant = input<string>("primary");
  showLabel = input<boolean>(false);
  indeterminate = input<boolean>(false);
  pill = input<boolean>(true);
  customColor = input<string>("transparent");
  customHeight = input<number>(8);


  
}
