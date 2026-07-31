// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'SidebarSection', standalone: true,
  host: { '[style.--qml-section-gap.px]': 'spacing()' },
  template: `<section class="qml-sidebar-section"><ng-content></ng-content></section>`,
  styles: [`
    :host { display:block; min-height:0; flex:1; } .qml-sidebar-section { height:100%; box-sizing:border-box; padding:8px; display:flex; flex-direction:column; gap:var(--qml-section-gap, 4px); overflow-y:auto; overflow-x:hidden; scrollbar-width:thin; scrollbar-color:var(--ctp-surface1, #45475a) transparent; }
    .qml-sidebar-section::-webkit-scrollbar { width:4px; } .qml-sidebar-section::-webkit-scrollbar-thumb { background:var(--ctp-surface1, #45475a); border-radius:4px; }
  `],
})
export class SidebarSection { spacing = input<number>(4); }
