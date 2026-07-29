// Auto-generated from design-system/MochaDS/Breadcrumb.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { BreadcrumbComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Breadcrumb',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"breadcrumb"',
  },
  template: `<ng-content></ng-content>`,
})
export class Breadcrumb {
  items = input<unknown>([]);
  separator = input<string>("chevron-right");
  size = input<string>("sm");


  
}
