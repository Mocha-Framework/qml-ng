// Refined manually. Do not overwrite.

import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'SidebarItem', standalone: true,
  template: `
    <div class="qml-sidebar-item-root" [class.open]="expanded()">
      <button class="qml-sidebar-item" [class.active]="isActive()" type="button" (click)="activate()">
        @if (icon()) { <qml-icon class="icon" [name]="icon()" size="20" /> }
        <span class="label">{{ label() }}</span>
        @if (hasChildren()) { <qml-icon class="chevron" name="chevron-right" size="16" /> }
      </button>
      <div class="qml-sidebar-subitems"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    :host { display:block; width:100%; } .qml-sidebar-item { width:100%; height:44px; box-sizing:border-box; display:flex; align-items:center; gap:12px; padding:0 16px; border:0; border-radius:8px; color:var(--ctp-text, #cdd6f4); background:transparent; font:14px var(--ctp-font-family, sans-serif); cursor:pointer; transition:transform 120ms cubic-bezier(.34,1.56,.64,1), background 150ms, color 150ms; }
    .qml-sidebar-item:hover { transform:scale(1.02); background:color-mix(in srgb, var(--ctp-surface0, #313244) 50%, transparent); } .qml-sidebar-item:active { transform:scale(.96); }
    .qml-sidebar-item.active { color:var(--ctp-mauve, #cba6f7); background:var(--ctp-surface0, #313244); font-weight:600; } .icon { flex:none; }
    .label { flex:1; text-align:left; white-space:nowrap; overflow:hidden; } .chevron { transition:transform 180ms ease-out; } .open .chevron { transform:rotate(90deg); }
    .qml-sidebar-subitems { display:grid; grid-template-rows:0fr; margin-left:24px; gap:4px; overflow:hidden; transition:grid-template-rows 250ms ease-in-out; } .open .qml-sidebar-subitems { grid-template-rows:1fr; }
    .qml-sidebar-subitems ::ng-deep > * { min-height:0; }
  `],
})
export class SidebarItem {
  icon = input<string>(''); label = input<string>(''); isActive = input<boolean>(false); expanded = model<boolean>(false); hasChildren = input<boolean>(false); clicked = output<void>();
  protected activate(): void { if (this.hasChildren()) this.expanded.update((value: boolean) => !value); this.clicked.emit(); }
}
