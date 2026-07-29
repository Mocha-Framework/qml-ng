
// Auto-generated from design-system/MochaDS/Router.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Router',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Router {
  initialRoute = input<string>("/");
  transitionDuration = input<number>(220);
  notFoundComponent = input<unknown>("_defaultNotFound");
  onRouteLeave = input<unknown>(null);
  onRouteEnter = input<unknown>(null);
  params = input<unknown>(undefined);
  router = input<unknown>(null);

  navigationStarted = output<{ path: string, params: unknown }>();
  navigationFinished = output<{ path: string, params: unknown }>();
  routeNotFound = output<{ path: string }>();
  navigationBlocked = output<{ path: string, reason: string }>();
}
