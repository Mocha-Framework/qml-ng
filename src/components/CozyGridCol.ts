// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'CozyGridCol', standalone: true,
  host: { '[style.grid-column]': 'column()', '[style.order]': 'order()', '[style.align-self]': 'selfAlign()' },
  template: `<div class="qml-cozy-grid-col"><ng-content></ng-content></div>`,
  styles: [`:host { display:block; min-width:0; } .qml-cozy-grid-col { width:100%; height:100%; }`],
})
export class CozyGridCol {
  span = input<number>(12); sm = input<number>(-1); md = input<number>(-1); lg = input<number>(-1); offset = input<number>(0); smOffset = input<number>(-1); mdOffset = input<number>(-1); lgOffset = input<number>(-1); alignSelf = input<string>(''); order = input<number>(0);
  protected column = computed(() => `${Math.max(1, this.offset() + 1)} / span ${Math.min(12, Math.max(1, this.span()))}`); protected selfAlign = computed(() => ({ start:'start', center:'center', end:'end', stretch:'stretch' } as Record<string, string>)[this.alignSelf()] ?? 'auto');
}
