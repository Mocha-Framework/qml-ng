
// Auto-generated from design-system/MochaDS/Box.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'Box',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"box"',
  },
  template: `
    <div [style.padding.px]="resolvedPadding()" [style.margin.px]="resolvedMargin()">
      <ng-content></ng-content>
    </div>`,
})
export class Box {
  p = input<unknown>(undefined);
  px = input<unknown>(undefined);
  py = input<unknown>(undefined);
  pt = input<unknown>(undefined);
  pr = input<unknown>(undefined);
  pb = input<unknown>(undefined);
  pl = input<unknown>(undefined);
  m = input<unknown>(undefined);
  mx = input<unknown>(undefined);
  my = input<unknown>(undefined);
  mt = input<unknown>(undefined);
  mr = input<unknown>(undefined);
  mb = input<unknown>(undefined);
  ml = input<unknown>(undefined);
  variant = input<string>("default");
  colorName = input<string>("");
  protected resolvedPadding = computed(() => 0);
  protected resolvedMargin = computed(() => 0);
}
