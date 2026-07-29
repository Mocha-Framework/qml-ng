
// Auto-generated from design-system/MochaDS/VStack.qml
// Do not edit manually. Run `pnpm generate` to regenerate.

import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'VStack',
  standalone: true,
  host: {
    '[style.display]': '"flex"',
    '[style.flex-direction]': 'reverse() ? "column-reverse" : "column"',
    '[style.gap.px]': 'spacing()',
    '[style.justify-content]': 'justifyCSS()',
    '[style.align-items]': 'alignCSS()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"',
    '[attr.data-qml-component]': '"vstack"',
  },
  template: `
    <ng-content></ng-content>`,
})
export class VStack {
  spacing = input<number>(12);
  spacingX = input<number>(-1);
  spacingY = input<number>(-1);
  justifyContent = input<string>("start");
  alignItems = input<string>("stretch");
  wrap = input<boolean>(false);
  reverse = input<boolean>(false);
  alignContent = input<string>("start");
  protected justifyCSS = computed(() => {
    const map: Record<string, string> = {
      start: 'flex-start', center: 'center', end: 'flex-end',
      between: 'space-between', around: 'space-around', evenly: 'space-evenly',
    };
    return map[this.justifyContent()] ?? 'flex-start';
  });

  protected alignCSS = computed(() => {
    const map: Record<string, string> = {
      start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch',
    };
    return map[this.alignItems()] ?? 'stretch';
  });
}
