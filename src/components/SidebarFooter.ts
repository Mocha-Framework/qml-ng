// Refined manually. Do not overwrite.

import { Component, input } from '@angular/core';

@Component({
  selector: 'SidebarFooter', standalone: true,
  template: `
    <footer class="qml-sidebar-footer" [class.collapsed]="!expanded()">
      @if (username()) {
        <span class="avatar"><qml-icon [name]="avatarIcon()" size="18" /></span>
        <div class="profile"><strong>{{ username() }}</strong>@if (email()) { <small>{{ email() }}</small> }</div>
      } @else { <ng-content></ng-content> }
    </footer>
  `,
  styles: [`
    :host { display:block; width:100%; } .qml-sidebar-footer { height:72px; box-sizing:border-box; padding:0 16px; display:flex; align-items:center; gap:8px; border-top:1px solid var(--ctp-surface0, #313244); overflow:hidden; }
    .avatar { width:36px; height:36px; flex:none; border-radius:50%; display:grid; place-items:center; color:var(--ctp-subtext1, #bac2de); background:var(--ctp-surface0, #313244); }
    .profile { display:flex; flex-direction:column; gap:2px; opacity:1; white-space:nowrap; transition:opacity 250ms ease; } .collapsed .profile { opacity:0; pointer-events:none; }
    strong { color:var(--ctp-text, #cdd6f4); font:500 14px var(--ctp-font-family, sans-serif); } small { color:var(--ctp-subtext0, #a6adc8); font:10px var(--ctp-font-family, sans-serif); }
  `],
})
export class SidebarFooter { username = input<string>(''); email = input<string>(''); avatarIcon = input<string>('user'); expanded = input<boolean>(true); }
