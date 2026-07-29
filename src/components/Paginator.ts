// Auto-generated from design-system/MochaDS/Paginator.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';
import { PaginationComponent } from '@mocha-ds/angular';

@Component({
  selector: 'Paginator',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"paginator"',
  },
  template: `<ng-content></ng-content>`,
})
export class Paginator {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  showGoToPage = input<boolean>(false);
  disabled = input<boolean>(false);
  suppressPageChangeAnim = input<boolean>(true);
  previousPage = input<number>(0);
  pageDirection = input<number>(0);

  pageChanged = output<{ page: number }>();

  
}
