// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'AdaptiveStack', standalone: true,
  host: { '[style.--qml-stack-gap.px]': 'spacing()' },
  template: `<div class="qml-adaptive-stack" [class.vertical]="direction() === 'vertical'" [style.justify-content]="justify()" [style.align-items]="align()"><ng-content></ng-content></div>`,
  styles: [`:host { display:block; width:100%; height:100%; } .qml-adaptive-stack { width:100%; height:100%; display:grid; grid-auto-flow:column; grid-auto-columns:max-content; gap:var(--qml-stack-gap, 16px); } .qml-adaptive-stack.vertical { grid-auto-flow:row; grid-auto-columns:auto; grid-auto-rows:max-content; }`],
})
export class AdaptiveStack {
  direction = input<'horizontal' | 'vertical'>('horizontal'); spacing = input<number>(16); justifyContent = input<string>('start'); alignItems = input<string>('center'); horizontalBreakpoint = input<string>('md');
  protected justify = computed(() => ({ start:'start', center:'center', end:'end', between:'space-between', around:'space-around', evenly:'space-evenly' } as Record<string, string>)[this.justifyContent()] ?? 'start'); protected align = computed(() => ({ start:'start', center:'center', end:'end', stretch:'stretch' } as Record<string, string>)[this.alignItems()] ?? 'center');
}
