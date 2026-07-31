// Refined manually. Do not overwrite.

import { Component, computed, input, model, output, signal } from '@angular/core';

interface TabItem { id: string; label: string; icon: string; }

@Component({
  selector: 'Tabs', standalone: true,
  template: `
    <div class="qml-tabs" [class]="'qml-tabs ' + variant()" [style.--qml-tabs-accent]="accent()" [style.--qml-tabs-text]="textColor()">
      <div class="qml-tabs-list" role="tablist">
        @for (tab of tabsList(); track tab.id; let i = $index) {
          <button class="qml-tab" [class.active]="i === currentIndex()" [class.held]="dragIndex() === i" type="button" role="tab" [attr.aria-selected]="i === currentIndex()" [draggable]="sortable()" (click)="selectTab(i)" (dragstart)="dragIndex.set(i)" (dragover)="$event.preventDefault()" (drop)="drop(i)" (dragend)="dragIndex.set(-1)">
            @if (tab.icon) { <qml-icon [name]="tab.icon" size="16" /> }<span>{{ tab.label }}</span>
          </button>
        }
      </div>
      <div class="qml-tabs-content"><ng-content></ng-content></div>
    </div>
  `,
  styles: [`
    .qml-tabs { width:100%; display:flex; flex-direction:column; font-family:var(--ctp-font-family, sans-serif); } .qml-tabs-list { height:40px; position:relative; display:flex; overflow-x:auto; scrollbar-width:none; border-bottom:1px solid var(--ctp-surface0, #313244); } .qml-tab { height:40px; min-width:max-content; padding:0 24px; position:relative; display:flex; align-items:center; justify-content:center; gap:8px; border:0; color:var(--ctp-subtext0, #a6adc8); background:transparent; font:14px inherit; cursor:pointer; transition:all 150ms; }
    .qml-tab:hover:not(.active) { color:var(--qml-tabs-text); background:color-mix(in srgb, var(--qml-tabs-accent) 10%, transparent); transform:scale(1.01); } .qml-tab.active { color:var(--qml-tabs-accent); font-weight:700; } .line .qml-tab.active::after { content:''; position:absolute; left:0; right:0; bottom:0; height:3px; background:var(--qml-tabs-accent); }
    .pill .qml-tabs-list { border:0; } .pill .qml-tab { height:32px; margin:4px 0; border-radius:999px; } .pill .qml-tab.active { color:var(--ctp-crust, #11111b); background:var(--qml-tabs-accent); }
    .segmented .qml-tabs-list { padding:4px; box-sizing:border-box; border:1px solid var(--ctp-surface0, #313244); border-radius:8px; background:var(--ctp-mantle, #181825); } .segmented .qml-tab { height:30px; flex:1; padding:0 16px; border-radius:6px; } .segmented .qml-tab.active { color:var(--ctp-text, #cdd6f4); background:var(--ctp-surface0, #313244); border:1px solid var(--ctp-surface1, #45475a); }
    .card .qml-tabs-list { gap:8px; border:0; } .card .qml-tab { border:1px solid var(--ctp-surface0, #313244); border-radius:8px; background:var(--ctp-mantle, #181825); } .card .qml-tab.active { color:var(--qml-tabs-accent); border-color:var(--qml-tabs-accent); background:var(--ctp-base, #1e1e2e); }
    .qml-tab.held { opacity:.8; transform:scale(1.05); } .qml-tabs-content { padding-top:16px; }
  `],
})
export class Tabs {
  model = input<unknown[]>([]); currentIndex = model<number>(0); variant = input<'line' | 'pill' | 'segmented' | 'card'>('line'); customAccentColor = input<string>('transparent'); customTextColor = input<string>('transparent'); sortable = input<boolean>(false); tabSelected = output<{ index: number; tabId: string }>(); tabsReordered = output<{ fromIndex: number; toIndex: number }>(); protected dragIndex = signal(-1);
  protected tabsList = computed<TabItem[]>(() => this.model().map((item: unknown, index: number) => typeof item === 'string' ? { id:item, label:item, icon:'' } : { id:String((item as Record<string, unknown>)['id'] ?? index), label:String((item as Record<string, unknown>)['label'] ?? ''), icon:String((item as Record<string, unknown>)['icon'] ?? '') }));
  protected accent = computed(() => this.customAccentColor() !== 'transparent' ? this.customAccentColor() : 'var(--ctp-primary, #cba6f7)'); protected textColor = computed(() => this.customTextColor() !== 'transparent' ? this.customTextColor() : 'var(--ctp-text, #cdd6f4)');
  protected selectTab(index: number): void { this.currentIndex.set(index); const tab=this.tabsList()[index]; if(tab) this.tabSelected.emit({ index, tabId:tab.id }); }
  protected drop(toIndex: number): void { const fromIndex=this.dragIndex(); if (!this.sortable() || fromIndex < 0 || fromIndex === toIndex) return; this.tabsReordered.emit({ fromIndex, toIndex }); if (this.currentIndex() === fromIndex) this.currentIndex.set(toIndex); this.dragIndex.set(-1); }
}
