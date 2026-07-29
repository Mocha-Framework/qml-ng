
// Auto-generated from design-system/MochaDS/Route.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Route',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Route {
  path = input<string>("");
  source = input<string>("");
  view = input<unknown>("null");
  title = input<string>("");
  canActivate = input<unknown>(null);
  canDeactivate = input<unknown>(null);
  guardRedirect = input<string>("");
}
