// Refined manually. Do not overwrite.

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'NavigationItem', standalone: true,
  template: `
    <button class="qml-navigation-item" [class.active]="isActive()" [class]="'qml-navigation-item ' + variant() + (isActive() ? ' active' : '')" type="button" (click)="clicked.emit()">
      <span class="icon-wrap"><qml-icon [name]="iconName()" size="24" /></span><span class="label">{{ label() }}</span>
    </button>
  `,
  styles: [`
    :host { display:inline-flex; } .qml-navigation-item { height:40px; min-width:40px; padding:0 8px; display:flex; align-items:center; justify-content:center; gap:0; border:0; border-radius:999px; color:var(--ctp-subtext0, #a6adc8); background:transparent; cursor:pointer; transition:all 180ms ease-out; }
    .qml-navigation-item:hover { color:var(--ctp-text, #cdd6f4); background:color-mix(in srgb, var(--ctp-primary, #cba6f7) 12%, transparent); transform:scale(1.01); } .qml-navigation-item:active { transform:scale(.97); }
    .qml-navigation-item.active { color:var(--ctp-base, #1e1e2e); background:var(--ctp-primary, #cba6f7); } .label { max-width:0; opacity:0; overflow:hidden; white-space:nowrap; font:500 14px var(--ctp-font-family, sans-serif); transition:max-width 220ms, opacity 140ms, margin 180ms; }
    .expanding.active .label { max-width:160px; opacity:1; margin-left:8px; } .floating.active { transform:translateY(-28px); box-shadow:0 4px 8px rgb(0 0 0/.18); }
    .labeled { width:72px; height:56px; flex-direction:column; } .labeled.active { background:transparent; color:var(--ctp-primary, #cba6f7); } .labeled.active .icon-wrap { width:40px; height:40px; display:grid; place-items:center; border-radius:50%; color:var(--ctp-base, #1e1e2e); background:var(--ctp-primary, #cba6f7); } .labeled.active .label { max-width:72px; opacity:1; font-size:10px; }
  `],
})
export class NavigationItem { iconName = input<string>(''); label = input<string>(''); variant = input<'standard' | 'floating' | 'expanding' | 'labeled'>('standard'); isActive = input<boolean>(false); clicked = output<void>(); }
