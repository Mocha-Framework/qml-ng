// Refined manually. Do not overwrite.

import { Component, computed, input, model, output } from '@angular/core';

export interface NavigationEntry { iconName: string; label: string; }

@Component({
  selector: 'NavigationBar', standalone: true,
  template: `
    <nav class="qml-navigation-bar" [class]="'qml-navigation-bar ' + variant()" [class.light]="!darkMode()" [style.--qml-nav-accent]="highlightColor()">
      <div class="qml-navigation-items">
        @for (item of items(); track $index; let i = $index) {
          <button class="qml-navigation-item" [class.active]="i === currentIndex()" type="button" (click)="select(i)">
            <span class="icon-wrap"><qml-icon [name]="item.iconName" size="24" /></span><span class="label">{{ item.label }}</span>
          </button>
        }
        <ng-content></ng-content>
      </div>
    </nav>
  `,
  styles: [`
    .qml-navigation-bar { min-width:max-content; height:56px; box-sizing:border-box; padding:0 12px; display:flex; align-items:center; border:1px solid var(--ctp-surface0, #313244); border-radius:999px; background:var(--ctp-crust, #11111b); box-shadow:0 2px 2px rgb(0 0 0/.12),0 4px 8px rgb(0 0 0/.08),0 6px 14px rgb(0 0 0/.04); }
    .qml-navigation-bar.light { background:var(--ctp-base, #1e1e2e); } .qml-navigation-items { display:flex; align-items:center; gap:20px; }
    .qml-navigation-item { height:40px; min-width:40px; padding:0 8px; display:flex; align-items:center; justify-content:center; gap:0; border:0; border-radius:999px; color:var(--ctp-subtext0, #a6adc8); background:transparent; cursor:pointer; transition:width 220ms ease-out, transform 120ms, background 180ms, color 180ms; }
    .qml-navigation-item:hover { transform:scale(1.01); background:color-mix(in srgb, var(--qml-nav-accent, var(--ctp-primary, #cba6f7)) 12%, transparent); color:var(--ctp-text, #cdd6f4); } .qml-navigation-item:active { transform:scale(.97); }
    .qml-navigation-item.active { color:var(--ctp-base, #1e1e2e); background:var(--qml-nav-accent, var(--ctp-primary, #cba6f7)); }
    .label { max-width:0; opacity:0; overflow:hidden; white-space:nowrap; font:500 14px var(--ctp-font-family, sans-serif); transition:max-width 220ms, opacity 140ms, margin 180ms; }
    .expanding .qml-navigation-item.active .label { max-width:160px; opacity:1; margin-left:8px; } .expanding .qml-navigation-items { gap:14px; }
    .floating .qml-navigation-item.active { transform:translateY(-28px); box-shadow:0 4px 8px rgb(0 0 0/.18); } .labeled { height:72px; } .labeled .qml-navigation-items { gap:12px; }
    .labeled .qml-navigation-item { width:72px; height:56px; flex-direction:column; } .labeled .qml-navigation-item.active .icon-wrap { width:40px; height:40px; display:grid; place-items:center; border-radius:50%; background:var(--qml-nav-accent, var(--ctp-primary, #cba6f7)); color:var(--ctp-base, #1e1e2e); }
    .labeled .qml-navigation-item.active { background:transparent; color:var(--qml-nav-accent, var(--ctp-primary, #cba6f7)); } .labeled .qml-navigation-item.active .label { max-width:72px; opacity:1; font-size:10px; }
  `],
})
export class NavigationBar {
  variant = input<'standard' | 'floating' | 'expanding' | 'labeled'>('standard'); currentIndex = model<number>(0); highlightColor = input<string>('var(--ctp-primary, #cba6f7)'); darkMode = input<boolean>(true); items = input<NavigationEntry[]>([]); currentIndexChanged = output<number>();
  protected select(index: number): void { this.currentIndex.set(index); this.currentIndexChanged.emit(index); }
}
