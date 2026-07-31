// Refined manually. Do not overwrite.

import { Component, input, computed } from '@angular/core';

export type CanActivateFn = (params: Record<string, string>, router: unknown) => boolean;
export type CanDeactivateFn = (params: Record<string, string>, router: unknown) => boolean;

@Component({
  selector: 'Route',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class Route {
  path = input<string>('');
  source = input<string>('');
  view = input<unknown>(null);
  title = input<string>('');
  canActivate = input<CanActivateFn | null>(null);
  canDeactivate = input<CanDeactivateFn | null>(null);
  guardRedirect = input<string>('');

  readonly isRoute = true;

  readonly resolved = computed(() => ({
    path: this.path(),
    source: this.source(),
    view: this.view(),
    title: this.title(),
    canActivate: this.canActivate(),
    canDeactivate: this.canDeactivate(),
    guardRedirect: this.guardRedirect(),
  }));
}
