// Refined manually. Do not overwrite.

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'CozyGrid', standalone: true,
  host: { '[style.--qml-grid-gap.px]': 'gapPixels()' },
  template: `<div class="qml-cozy-grid" [class.no-wrap]="!multiline()" [class.stack-mobile]="!mobile()" [style.justify-content]="justify()" [style.align-items]="alignItems()"><ng-content></ng-content></div>`,
  styles: [`
    :host { display:block; width:100%; } .qml-cozy-grid { width:100%; display:grid; grid-template-columns:repeat(12, minmax(0,1fr)); gap:var(--qml-grid-gap, 16px); } .no-wrap { grid-auto-flow:column; }
    @media (max-width:767px) { .stack-mobile ::ng-deep > CozyGridCol { grid-column:1 / -1 !important; margin-left:0 !important; } }
  `],
})
export class CozyGrid {
  mobile = input<boolean>(false); multiline = input<boolean>(true); gap = input<number>(3); align = input<string>('start'); valign = input<string>('start'); model = input<unknown>(null); delegate = input<unknown>(null);
  protected gapPixels = computed(() => [0,4,8,16,24,32][this.gap()] ?? 16); protected justify = computed(() => ({ start:'start', center:'center', end:'end', 'space-between':'space-between', 'space-around':'space-around' } as Record<string, string>)[this.align()] ?? 'start'); protected alignItems = computed(() => ({ start:'start', center:'center', end:'end', stretch:'stretch' } as Record<string, string>)[this.valign()] ?? 'start');
}
