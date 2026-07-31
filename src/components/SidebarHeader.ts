// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'SidebarHeader', standalone: true,
  template: `
    <header class="qml-sidebar-header" [class.collapsed]="!expanded()">
      @if (title() || logoIcon()) {
        @if (logoIcon()) { <qml-icon class="logo" [name]="logoIcon()" size="24" /> }
        <div class="text"><strong>{{ title() }}</strong>@if (subtitle()) { <small>{{ subtitle() }}</small> }</div>
      } @else { <ng-content></ng-content> }
    </header>
  `,
  styles: [`
    :host { display:block; width:100%; } .qml-sidebar-header { height:72px; box-sizing:border-box; padding:0 16px; display:flex; align-items:center; gap:8px; border-bottom:1px solid var(--ctp-surface0, #313244); overflow:hidden; }
    .logo { color:var(--ctp-primary, #cba6f7); flex:none; } .text { display:flex; flex-direction:column; gap:2px; opacity:1; white-space:nowrap; transition:opacity 250ms ease; }
    .collapsed .text { opacity:0; pointer-events:none; } strong { color:var(--ctp-text, #cdd6f4); font:700 16px var(--ctp-font-family, sans-serif); } small { color:var(--ctp-subtext0, #a6adc8); font:10px var(--ctp-font-family, sans-serif); }
  `],
})
export class SidebarHeader { title = input<string>(''); subtitle = input<string>(''); logoIcon = input<string>(''); expanded = input<boolean>(true); }
